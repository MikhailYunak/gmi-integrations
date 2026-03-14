import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Dialog } from '@angular/cdk/dialog';
import { filter, map, merge, switchMap } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from '@gmi-integrations/shared';
import { applyServerErrors, isValidationError } from '@gmi-integrations/cdk';
import { isConflictError, StepsApiService } from '../services/steps-api.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { QuoteApplicationStatus, StepOneModel } from '../models/steps.models';
import { GENERAL_INFORMATION_STATUS_ROUTE } from '../const/status-route';

export type ClaimGroup = {
    claimAmount: FormControl<string>;
    claimDescription: FormControl<string>;
};

@Injectable()
export class StepOneFormService {
    private readonly _fb = inject(FormBuilder);

    private readonly _api = inject(StepsApiService);

    private readonly _storage = inject(LocalStorageService);

    private readonly _router = inject(Router);

    private readonly _dialog = inject(Dialog);

    private readonly _destroyRef = inject(DestroyRef);

    readonly form = this._fb.group({
        generalInfo: this._fb.nonNullable.group({
            fullName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^\d{3} \d{3} \d{4}$/)]]
        }),
        businessInfo: this._fb.group({
            legalBusinessName: this._fb.nonNullable.control('', [Validators.required]),
            hasDba: this._fb.nonNullable.control(false),
            dba: this._fb.nonNullable.control(''),
            businessState: this._fb.control<string | null>(null, [Validators.required]),
            businessStartDate: this._fb.nonNullable.control('', [
                Validators.required,
                Validators.pattern(/^\d{2}\/\d{4}$/)
            ]),
            numEmployees: this._fb.nonNullable.control('1', [Validators.required]),
            businessZipCode: this._fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d{5}$/)])
        }),
        hasPreviousClaims: this._fb.control<boolean | null>(null, [Validators.required]),
        previousClaims: this._fb.array<FormGroup<ClaimGroup>>([])
    });

    readonly formChange = toSignal(merge(this.form.statusChanges, this.form.valueChanges), { initialValue: null });

    private readonly _hasDba = toSignal(this.form.controls.businessInfo.controls.hasDba.valueChanges, {
        initialValue: false
    });

    private readonly _hasClaims = toSignal(this.form.controls.hasPreviousClaims.valueChanges, {
        initialValue: null as boolean | null
    });

    readonly showDba = computed(() => this._hasDba());

    readonly showClaimsSection = computed(() => this._hasClaims() === true);

    readonly claims = signal<FormGroup<ClaimGroup>[]>([]);

    readonly isLoading = signal(false);

    constructor() {
        effect(() => {
            const hasClaims = this._hasClaims();
            if (hasClaims === true && this.form.controls.previousClaims.length === 0) {
                this._pushClaim();
            } else if (hasClaims === false) {
                this.form.controls.previousClaims.clear();
                this.claims.set([]);
            }
        });

        this._initMasks();

        const saved = this._storage.getStep1Data();
        if (saved) {
            this._patchForm(saved);
        }
    }

    addClaim(): void {
        this._pushClaim();
    }

    removeClaim(index: number): void {
        this.form.controls.previousClaims.removeAt(index);
        this.claims.update((arr) => arr.filter((_, i) => i !== index));
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const dto = this._buildModel();
        const uuid = this._storage.getUuid();
        this.isLoading.set(true);

        const request$ = uuid ? this._api.updateStepOne(uuid, dto) : this._api.createApplication(dto);

        request$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
            next: (app) => {
                this._storage.save(app);
                this.isLoading.set(false);
                this._router.navigate(
                    GENERAL_INFORMATION_STATUS_ROUTE[app.status as QuoteApplicationStatus] ??
                        GENERAL_INFORMATION_STATUS_ROUTE.STEP_TWO
                );
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading.set(false);
                if (isConflictError(err)) {
                    this._openConflictDialog(err.error.activeQuoteUuid, dto);
                } else if (isValidationError(err)) {
                    applyServerErrors(err.error.errors, this.form);
                }
            }
        });
    }

    private _openConflictDialog(activeUuid: string, dto: StepOneModel): void {
        const ref = this._dialog.open<boolean, ConfirmDialogData>(ConfirmDialog, {
            data: {
                title: 'Active Application Found',
                message: 'You already have an active quote application. Please Continue or Start Over it first.',
                confirmLabel: 'Continue',
                cancelLabel: 'Start Over'
            },
            disableClose: true,
            backdropClass: 'cdk-overlay-dark-backdrop',
            ariaLabelledBy: 'confirm-dialog-title'
        });

        ref.closed.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
            if (result === true) {
                this._continueExisting(activeUuid);
            } else {
                this._startOver(activeUuid, dto);
            }
        });
    }

    private _continueExisting(uuid: string): void {
        this.isLoading.set(true);
        this._api
            .getApplication(uuid)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (app) => {
                    this._storage.save(app);
                    this.isLoading.set(false);
                    this._router.navigate(
                        GENERAL_INFORMATION_STATUS_ROUTE[app.status as QuoteApplicationStatus] ??
                            GENERAL_INFORMATION_STATUS_ROUTE.STEP_TWO
                    );
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
    }

    private _startOver(uuid: string, dto: StepOneModel): void {
        this.isLoading.set(true);

        this._api
            .cancelApplication(uuid)
            .pipe(
                switchMap(() => this._api.createApplication(dto)),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (app) => {
                    this._storage.save(app);
                    this.isLoading.set(false);
                    this._router.navigate(GENERAL_INFORMATION_STATUS_ROUTE.STEP_TWO);
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
    }

    private _pushClaim(): void {
        const group = this._fb.group({
            claimAmount: this._fb.nonNullable.control('', [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/)
            ]),
            claimDescription: this._fb.nonNullable.control('', [Validators.required])
        }) as FormGroup<ClaimGroup>;

        this.form.controls.previousClaims.push(group);
        this.claims.update((arr) => [...arr, group]);
    }

    private _buildModel(): StepOneModel {
        const raw = this.form.getRawValue();

        return {
            generalInfo: {
                fullName: raw.generalInfo.fullName,
                email: raw.generalInfo.email,
                phone: `+1${raw.generalInfo.phone.replace(/\s/g, '')}`
            },
            businessInfo: {
                legalBusinessName: raw.businessInfo.legalBusinessName,
                ...(raw.businessInfo.hasDba && { dba: raw.businessInfo.dba }),
                businessState: raw.businessInfo.businessState ?? '',
                businessStartDate: this._toIsoDate(raw.businessInfo.businessStartDate),
                numEmployees: Number(raw.businessInfo.numEmployees),
                businessZipCode: raw.businessInfo.businessZipCode
            },
            hasPreviousClaims: raw.hasPreviousClaims ?? false,
            ...(raw.hasPreviousClaims && {
                previousClaims: raw.previousClaims.map((c) => ({
                    claimAmount: Number(c.claimAmount),
                    claimDescription: c.claimDescription
                }))
            })
        };
    }

    private _patchForm(data: StepOneModel): void {
        this.form.patchValue({
            generalInfo: {
                fullName: data.generalInfo.fullName,
                email: data.generalInfo.email,
                phone: data.generalInfo.phone.replace(/^\+1/, '')
            },
            businessInfo: {
                legalBusinessName: data.businessInfo.legalBusinessName,
                hasDba: !!data.businessInfo.dba,
                dba: data.businessInfo.dba ?? '',
                businessState: data.businessInfo.businessState,
                businessStartDate: this._fromIsoDate(data.businessInfo.businessStartDate),
                numEmployees: String(data.businessInfo.numEmployees),
                businessZipCode: data.businessInfo.businessZipCode
            },
            hasPreviousClaims: data.hasPreviousClaims
        });

        if (data.hasPreviousClaims && data.previousClaims?.length) {
            this.form.controls.previousClaims.clear();
            this.claims.set([]);
            data.previousClaims.forEach(() => this._pushClaim());
            data.previousClaims.forEach((c, i) => {
                this.form.controls.previousClaims.at(i).patchValue({
                    claimAmount: String(c.claimAmount),
                    claimDescription: c.claimDescription
                });
            });
        }
    }

    private _initMasks(): void {
        const { phone } = this.form.controls.generalInfo.controls;
        const { businessStartDate } = this.form.controls.businessInfo.controls;

        merge(
            phone.valueChanges.pipe(map((val) => ({ ctrl: phone, formatted: this._applyPhoneMask(val), val }))),
            businessStartDate.valueChanges.pipe(
                map((val) => ({ ctrl: businessStartDate, formatted: this._applyDateMask(val), val }))
            )
        )
            .pipe(
                filter(({ val, formatted }) => formatted !== val),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(({ ctrl, formatted }) => ctrl.setValue(formatted, { emitEvent: false }));
    }

    private _applyPhoneMask(value: string): string {
        const digits = value.replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 3) {
            return digits;
        }
        if (digits.length <= 6) {
            return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        }
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }

    private _applyDateMask(value: string): string {
        const digits = value.replace(/\D/g, '').slice(0, 6);
        if (digits.length <= 2) {
            return digits;
        }
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    private _toIsoDate(value: string): string {
        const [mm, yyyy] = value.split('/');
        return `${yyyy}-${mm}-01`;
    }

    private _fromIsoDate(value: string): string {
        const [yyyy, mm] = value.split('-');
        return `${mm}/${yyyy}`;
    }
}
