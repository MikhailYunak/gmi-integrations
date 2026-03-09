import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { merge, switchMap } from 'rxjs';
import { InsuranceApiService, isConflictError } from './insurance-api.service';
import { InsuranceStorageService } from './insurance-storage.service';
import { QuoteApplicationStatus, StepOneModel, StepTwoModel } from '../models/insurance.models';

// ── Form group types ──────────────────────────────────────────────────────────

export type ClaimGroup = {
    claimAmount: FormControl<string>;
    claimDescription: FormControl<string>;
};

// ── Route map ─────────────────────────────────────────────────────────────────

const STATUS_ROUTE: Record<QuoteApplicationStatus, string[]> = {
    STEP_ONE: ['/insurance', 'general-information'],
    STEP_TWO: ['/insurance', 'about-your-restaurant'],
    STEP_THREE: ['/insurance', 'general-liability'],
    COMPLETED: ['/insurance', 'general-information'],
    CANCELLED: ['/insurance', 'general-information']
};

@Injectable()
export class InsuranceFormService {
    private readonly _fb = inject(FormBuilder);

    private readonly _api = inject(InsuranceApiService);

    private readonly _storage = inject(InsuranceStorageService);

    private readonly _router = inject(Router);

    // ── Step 1 Form ───────────────────────────────────────────────────────────

    readonly form = this._fb.group({
        generalInfo: this._fb.nonNullable.group({
            fullName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
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

    // ── Step 2 Form ───────────────────────────────────────────────────────────

    readonly step2Form = this._fb.group({
        financials: this._fb.nonNullable.group({
            annualEarnings: this._fb.nonNullable.control('', [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/)
            ]),
            annualPayroll: this._fb.nonNullable.control('', [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/)
            ])
        }),
        primaryLocation: this._fb.nonNullable.group({
            street: ['', [Validators.required]],
            city: ['', [Validators.required]],
            state: this._fb.control<string | null>(null, [Validators.required]),
            zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
        }),
        isMailingSameAsPrimary: this._fb.nonNullable.control<boolean>(true, [Validators.required]),
        mailingAddress: this._fb.nonNullable.group({
            street: [''],
            city: [''],
            state: this._fb.control<string | null>(null),
            zip: ['']
        })
    });

    // ── Reactive signals (Step 1) ─────────────────────────────────────────────

    readonly formChange = toSignal(merge(this.form.statusChanges, this.form.valueChanges), { initialValue: null });

    private readonly _hasDba = toSignal(this.form.controls.businessInfo.controls.hasDba.valueChanges, {
        initialValue: false
    });

    private readonly _hasClaims = toSignal(this.form.controls.hasPreviousClaims.valueChanges, {
        initialValue: null as boolean | null
    });

    readonly showDba = computed(() => this._hasDba());

    readonly showClaimsSection = computed(() => this._hasClaims() === true);

    /** Signal-driven list of claim FormGroups for template `@for` rendering. */
    readonly claims = signal<FormGroup<ClaimGroup>[]>([]);

    // ── Reactive signals (Step 2) ─────────────────────────────────────────────

    readonly step2FormChange = toSignal(merge(this.step2Form.statusChanges, this.step2Form.valueChanges), {
        initialValue: null
    });

    private readonly _isMailingSameAsPrimary = toSignal(this.step2Form.controls.isMailingSameAsPrimary.valueChanges, {
        initialValue: true as boolean
    });

    readonly showMailingAddress = computed(() => this._isMailingSameAsPrimary() === false);

    // ── State ─────────────────────────────────────────────────────────────────

    readonly isLoading = signal(false);

    /**
     * When non-null, a 409 conflict was detected. The component should show
     * a "Continue or Start Over" dialog.
     */
    readonly conflictUuid = signal<string | null>(null);

    // ── Constructor ───────────────────────────────────────────────────────────

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

        effect(() => {
            const isMailingSame = this._isMailingSameAsPrimary();
            const ctrl = this.step2Form.controls.mailingAddress.controls;

            if (isMailingSame === false) {
                ctrl.street.setValidators([Validators.required]);
                ctrl.city.setValidators([Validators.required]);
                ctrl.state.setValidators([Validators.required]);
                ctrl.zip.setValidators([Validators.required, Validators.pattern(/^\d{5}$/)]);
            } else {
                ctrl.street.clearValidators();
                ctrl.city.clearValidators();
                ctrl.state.clearValidators();
                ctrl.zip.clearValidators();
            }

            Object.values(ctrl).forEach((c) => c.updateValueAndValidity({ emitEvent: false }));
        });

        const step1 = this._storage.getStep1Data();
        if (step1) {
            this._patchStep1(step1);
        }

        const step2 = this._storage.getStep2Data();
        if (step2) {
            this._patchStep2(step2);
        }
    }

    // ── Claims helpers ────────────────────────────────────────────────────────

    addClaim(): void {
        this._pushClaim();
    }

    removeClaim(index: number): void {
        this.form.controls.previousClaims.removeAt(index);
        this.claims.update((arr) => arr.filter((_, i) => i !== index));
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    goBack(): void {
        this._router.navigate(['/insurance', 'general-information']);
    }

    // ── Submit flow (Step 1) ──────────────────────────────────────────────────

    submitStepOne(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const dto = this._buildStep1Model();
        const uuid = this._storage.getUuid();
        this.isLoading.set(true);

        const request$ = uuid ? this._api.updateStepOne(uuid, dto) : this._api.createApplication(dto);

        request$.subscribe({
            next: (app) => {
                this._storage.save(app);
                this.isLoading.set(false);
                this._router.navigate(STATUS_ROUTE[app.status as QuoteApplicationStatus] ?? STATUS_ROUTE.STEP_TWO);
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading.set(false);
                if (isConflictError(err)) {
                    this.conflictUuid.set(err.error.activeQuoteUuid);
                }
            }
        });
    }

    /** User chose "Continue existing application" in the conflict dialog. */
    continueExisting(): void {
        const uuid = this.conflictUuid();
        if (!uuid) {
            return;
        }

        this.isLoading.set(true);
        this._api.getApplication(uuid).subscribe({
            next: (app) => {
                this._storage.save(app);
                this.conflictUuid.set(null);
                this.isLoading.set(false);
                this._router.navigate(STATUS_ROUTE[app.status as QuoteApplicationStatus] ?? STATUS_ROUTE.STEP_ONE);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    /** User chose "Start over" in the conflict dialog. */
    startOver(): void {
        const uuid = this.conflictUuid();
        if (!uuid) {
            return;
        }

        this.isLoading.set(true);
        const dto = this._buildStep1Model();

        this._api
            .cancelApplication(uuid)
            .pipe(switchMap(() => this._api.createApplication(dto)))
            .subscribe({
                next: (app) => {
                    this._storage.save(app);
                    this.conflictUuid.set(null);
                    this.isLoading.set(false);
                    this._router.navigate(STATUS_ROUTE.STEP_TWO);
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
    }

    // ── Submit flow (Step 2) ──────────────────────────────────────────────────

    submitStepTwo(): void {
        if (this.step2Form.invalid) {
            this.step2Form.markAllAsTouched();
            return;
        }

        const uuid = this._storage.getUuid();
        if (!uuid) {
            this._router.navigate(['/insurance', 'general-information']);
            return;
        }

        const dto = this._buildStep2Model();
        this.isLoading.set(true);

        this._api.updateStepTwo(uuid, dto).subscribe({
            next: (app) => {
                this._storage.save(app);
                this.isLoading.set(false);
                this._router.navigate(STATUS_ROUTE[app.status as QuoteApplicationStatus] ?? STATUS_ROUTE.STEP_THREE);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    // ── Private helpers ───────────────────────────────────────────────────────

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

    private _buildStep1Model(): StepOneModel {
        const raw = this.form.getRawValue();

        return {
            generalInfo: {
                fullName: raw.generalInfo.fullName,
                email: raw.generalInfo.email,
                phone: `+1${raw.generalInfo.phone}`
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

    private _buildStep2Model(): StepTwoModel {
        const raw = this.step2Form.getRawValue();
        const isMailingSameAsPrimary = raw.isMailingSameAsPrimary;

        return {
            financials: {
                annualEarnings: Number(raw.financials.annualEarnings),
                annualPayroll: Number(raw.financials.annualPayroll)
            },
            primaryLocation: {
                street: raw.primaryLocation.street,
                city: raw.primaryLocation.city,
                state: raw.primaryLocation.state ?? '',
                zip: raw.primaryLocation.zip
            },
            isMailingSameAsPrimary,
            mailingAddress: isMailingSameAsPrimary
                ? {
                      street: raw.primaryLocation.street,
                      city: raw.primaryLocation.city,
                      state: raw.primaryLocation.state ?? '',
                      zip: raw.primaryLocation.zip
                  }
                : {
                      street: raw.mailingAddress.street,
                      city: raw.mailingAddress.city,
                      state: raw.mailingAddress.state ?? '',
                      zip: raw.mailingAddress.zip
                  }
        };
    }

    private _patchStep1(data: StepOneModel): void {
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
            data.previousClaims.forEach((c) => {
                this._pushClaim();
            });
            data.previousClaims.forEach((c, i) => {
                this.form.controls.previousClaims.at(i).patchValue({
                    claimAmount: String(c.claimAmount),
                    claimDescription: c.claimDescription
                });
            });
        }
    }

    private _patchStep2(data: StepTwoModel): void {
        this.step2Form.patchValue({
            financials: {
                annualEarnings: String(data.financials.annualEarnings),
                annualPayroll: String(data.financials.annualPayroll)
            },
            primaryLocation: {
                street: data.primaryLocation.street,
                city: data.primaryLocation.city,
                state: data.primaryLocation.state,
                zip: data.primaryLocation.zip
            },
            isMailingSameAsPrimary: data.isMailingSameAsPrimary,
            mailingAddress: {
                street: data.mailingAddress.street,
                city: data.mailingAddress.city,
                state: data.mailingAddress.state,
                zip: data.mailingAddress.zip
            }
        });
    }

    /** Converts UI "MM/YYYY" → ISO "YYYY-MM-01" */
    private _toIsoDate(value: string): string {
        const [mm, yyyy] = value.split('/');
        return `${yyyy}-${mm}-01`;
    }

    /** Converts ISO "YYYY-MM-DD" → UI "MM/YYYY" */
    private _fromIsoDate(value: string): string {
        const [yyyy, mm] = value.split('-');
        return `${mm}/${yyyy}`;
    }
}
