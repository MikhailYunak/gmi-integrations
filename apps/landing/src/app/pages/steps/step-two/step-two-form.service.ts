import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter, map, merge } from 'rxjs';
import { applyServerErrors, isValidationError } from '@gmi-integrations/cdk';
import { StepsApiService } from '../services/steps-api.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { StepTwoModel } from '../models/steps.models';

@Injectable()
export class StepTwoFormService {
    private readonly _fb = inject(FormBuilder);

    private readonly _api = inject(StepsApiService);

    private readonly _storage = inject(LocalStorageService);

    private readonly _router = inject(Router);

    private readonly _destroyRef = inject(DestroyRef);

    readonly form = this._fb.group({
        financials: this._fb.nonNullable.group({
            annualEarnings: ['', [Validators.required, Validators.pattern(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/)]],
            annualPayroll: ['', [Validators.required, Validators.pattern(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/)]]
        }),
        primaryLocation: this._fb.nonNullable.group({
            street: ['', [Validators.required]],
            city: ['', [Validators.required]],
            state: this._fb.control<string | null>(null, [Validators.required]),
            zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
        }),
        isMailingSameAsPrimary: this._fb.control<boolean | null>(null, [Validators.required]),
        mailingAddress: this._fb.nonNullable.group({
            street: [''],
            city: [''],
            state: this._fb.control<string | null>(null),
            zip: ['']
        })
    });

    readonly formChange = toSignal(merge(this.form.statusChanges, this.form.valueChanges), { initialValue: null });

    private readonly _isMailingSameAsPrimary = toSignal(this.form.controls.isMailingSameAsPrimary.valueChanges, {
        initialValue: null as boolean | null
    });

    readonly showMailingAddress = computed(() => this._isMailingSameAsPrimary() === false);

    readonly isLoading = signal(false);

    constructor() {
        effect(() => {
            const mailing = this.form.controls.mailingAddress.controls;
            if (this._isMailingSameAsPrimary() === false) {
                mailing.street.setValidators([Validators.required]);
                mailing.city.setValidators([Validators.required]);
                mailing.state.setValidators([Validators.required]);
                mailing.zip.setValidators([Validators.required, Validators.pattern(/^\d{5}$/)]);
            } else {
                mailing.street.clearValidators();
                mailing.city.clearValidators();
                mailing.state.clearValidators();
                mailing.zip.clearValidators();
            }
            mailing.street.updateValueAndValidity();
            mailing.city.updateValueAndValidity();
            mailing.state.updateValueAndValidity();
            mailing.zip.updateValueAndValidity();
        });

        this._initMasks();

        const saved = this._storage.getStep2Data();
        if (saved) {
            this._patchForm(saved);
        }
    }

    goBack(): void {
        this._router.navigate(['/steps', 'step-one']);
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const uuid = this._storage.getUuid();
        if (!uuid) {
            this._router.navigate(['/steps', 'step-one']);
            return;
        }

        const dto = this._buildModel();
        this.isLoading.set(true);

        this._api
            .updateStepTwo(uuid, dto)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (app) => {
                    this._storage.save(app);
                    this.isLoading.set(false);
                    this._router.navigate(['/steps', 'step-three']);
                },
                error: (err: HttpErrorResponse) => {
                    this.isLoading.set(false);
                    if (isValidationError(err)) {
                        applyServerErrors(err.error.errors, this.form);
                    }
                }
            });
    }

    private _buildModel(): StepTwoModel {
        const raw = this.form.getRawValue();
        const isSame = raw.isMailingSameAsPrimary ?? true;

        return {
            financials: {
                annualEarnings: Number(raw.financials.annualEarnings.replace(/,/g, '')),
                annualPayroll: Number(raw.financials.annualPayroll.replace(/,/g, ''))
            },
            primaryLocation: {
                street: raw.primaryLocation.street,
                city: raw.primaryLocation.city,
                state: raw.primaryLocation.state ?? '',
                zip: raw.primaryLocation.zip
            },
            isMailingSameAsPrimary: isSame,
            mailingAddress: isSame
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

    private _initMasks(): void {
        const { annualEarnings, annualPayroll } = this.form.controls.financials.controls;

        merge(
            annualEarnings.valueChanges.pipe(map((val) => ({ ctrl: annualEarnings, formatted: this._applyNumberMask(val), val }))),
            annualPayroll.valueChanges.pipe(map((val) => ({ ctrl: annualPayroll, formatted: this._applyNumberMask(val), val })))
        )
            .pipe(
                filter(({ val, formatted }) => formatted !== val),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(({ ctrl, formatted }) => ctrl.setValue(formatted, { emitEvent: false }));
    }

    private _applyNumberMask(value: string): string {
        const cleaned = value.replace(/[^\d.]/g, '');
        const [intPart, ...rest] = cleaned.split('.');
        const dec = rest.length > 0 ? '.' + rest.join('').slice(0, 2) : '';
        return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + dec;
    }

    private _patchForm(data: StepTwoModel): void {
        this.form.patchValue({
            financials: {
                annualEarnings: this._applyNumberMask(String(data.financials.annualEarnings)),
                annualPayroll: this._applyNumberMask(String(data.financials.annualPayroll))
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
}
