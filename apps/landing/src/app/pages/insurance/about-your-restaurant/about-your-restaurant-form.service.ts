import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { InsuranceApiService } from '../services/insurance-api.service';
import { InsuranceStorageService } from '../services/insurance-storage.service';
import { StepTwoModel } from '../models/insurance.models';

@Injectable()
export class AboutYourRestaurantFormService {
    private readonly _fb = inject(FormBuilder);

    private readonly _api = inject(InsuranceApiService);

    private readonly _storage = inject(InsuranceStorageService);

    private readonly _router = inject(Router);

    private readonly _destroyRef = inject(DestroyRef);

    readonly form = this._fb.group({
        financials: this._fb.nonNullable.group({
            annualEarnings: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
            annualPayroll: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
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

        const saved = this._storage.getStep2Data();
        if (saved) {
            this._patchForm(saved);
        }
    }

    goBack(): void {
        this._router.navigate(['/insurance', 'general-information']);
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const uuid = this._storage.getUuid();
        if (!uuid) {
            this._router.navigate(['/insurance', 'general-information']);
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
                    this._router.navigate(['/insurance', 'general-liability']);
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
    }

    private _buildModel(): StepTwoModel {
        const raw = this.form.getRawValue();
        const isSame = raw.isMailingSameAsPrimary ?? true;

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

    private _patchForm(data: StepTwoModel): void {
        this.form.patchValue({
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
}
