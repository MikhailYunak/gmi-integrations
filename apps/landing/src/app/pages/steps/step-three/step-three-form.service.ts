import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { merge, switchMap } from 'rxjs';
import { applyServerErrors, isValidationError } from '@gmi-integrations/cdk';
import { InsuranceApiService } from '../services/insurance-api.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { StepThreeModel } from '../models/insurance.models';
import { QuoteStateService } from '../../state/quote-state.service';

@Injectable()
export class StepThreeFormService {
    private readonly _fb = inject(FormBuilder);

    private readonly _api = inject(InsuranceApiService);

    private readonly _storage = inject(LocalStorageService);

    private readonly _router = inject(Router);

    private readonly _quoteState = inject(QuoteStateService);

    private readonly _destroyRef = inject(DestroyRef);

    readonly form = this._fb.group({
        glLimit: this._fb.nonNullable.control<number>(300000, [Validators.required]),
        liquorLiability: this._fb.nonNullable.group({
            shouldInclude: this._fb.nonNullable.control(false),
            alcoholicBeverageSales: this._fb.nonNullable.control('')
        }),
        hasCyberCoverage: this._fb.nonNullable.control(false),
        cyberCoverageLimit: this._fb.nonNullable.control(''),
        hasEpli: this._fb.nonNullable.control(false),
        epliLimit: this._fb.nonNullable.control(''),
        epliRetention: this._fb.control<number | null>(null)
    });

    readonly formChange = toSignal(merge(this.form.statusChanges, this.form.valueChanges), { initialValue: null });

    private readonly _liquorSelected = toSignal(
        this.form.controls.liquorLiability.controls.shouldInclude.valueChanges,
        { initialValue: false }
    );

    private readonly _cyberSelected = toSignal(this.form.controls.hasCyberCoverage.valueChanges, {
        initialValue: false
    });

    private readonly _epliSelected = toSignal(this.form.controls.hasEpli.valueChanges, { initialValue: false });

    readonly showLiquorFields = computed(() => this._liquorSelected());

    readonly showCyberFields = computed(() => this._cyberSelected());

    readonly showEpliFields = computed(() => this._epliSelected());

    readonly isLoading = signal(false);

    constructor() {
        effect(() => {
            const salesCtrl = this.form.controls.liquorLiability.controls.alcoholicBeverageSales;
            if (this._liquorSelected()) {
                salesCtrl.setValidators([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]);
                if (this.form.controls.glLimit.value === 2000000) {
                    this.form.controls.glLimit.setValue(1000000);
                }
            } else {
                salesCtrl.clearValidators();
            }
            salesCtrl.updateValueAndValidity();
        });

        effect(() => {
            const limitCtrl = this.form.controls.cyberCoverageLimit;
            if (this._cyberSelected()) {
                limitCtrl.setValidators([Validators.required]);
            } else {
                limitCtrl.clearValidators();
            }
            limitCtrl.updateValueAndValidity();
        });

        effect(() => {
            const limitCtrl = this.form.controls.epliLimit;
            const retentionCtrl = this.form.controls.epliRetention;
            if (this._epliSelected()) {
                limitCtrl.setValidators([Validators.required]);
                retentionCtrl.setValidators([Validators.required]);
            } else {
                limitCtrl.clearValidators();
                retentionCtrl.clearValidators();
            }
            limitCtrl.updateValueAndValidity();
            retentionCtrl.updateValueAndValidity();
        });

        const saved = this._storage.getStep3Data();
        if (saved) {
            this._patchForm(saved);
        }
    }

    goBack(): void {
        this._router.navigate(['/steps', 'step-two']);
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
            .updateStepThree(uuid, dto)
            .pipe(
                switchMap((app) => {
                    this._storage.save(app);
                    return this._api.submitApplication(uuid);
                }),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (result) => {
                    this._quoteState.set(result);
                    this.isLoading.set(false);
                    this._router.navigate(['/quotes']);
                },
                error: (err: HttpErrorResponse) => {
                    this.isLoading.set(false);
                    if (isValidationError(err)) {
                        applyServerErrors(err.error.errors, this.form);
                    }
                }
            });
    }

    private _buildModel(): StepThreeModel {
        const raw = this.form.getRawValue();

        return {
            coverage: {
                glLimit: raw.glLimit
            },
            cyberCoverage: raw.hasCyberCoverage ? { limits: raw.cyberCoverageLimit } : null,
            epli: raw.hasEpli
                ? {
                      limits: raw.epliLimit,
                      retention: raw.epliRetention ?? 0
                  }
                : null,
            liquorLiability: {
                shouldInclude: raw.liquorLiability.shouldInclude,
                alcoholicBeverageSales: raw.liquorLiability.shouldInclude
                    ? Number(raw.liquorLiability.alcoholicBeverageSales)
                    : 0,
                liquorLiabLimitEachOccurrence: raw.glLimit
            }
        };
    }

    private _patchForm(data: StepThreeModel): void {
        this.form.patchValue({
            glLimit: data.coverage.glLimit,
            liquorLiability: {
                shouldInclude: data.liquorLiability.shouldInclude,
                alcoholicBeverageSales: data.liquorLiability.shouldInclude
                    ? String(data.liquorLiability.alcoholicBeverageSales)
                    : ''
            },
            hasCyberCoverage: data.cyberCoverage !== null,
            cyberCoverageLimit: data.cyberCoverage?.limits ?? '',
            hasEpli: data.epli !== null,
            epliLimit: data.epli?.limits ?? '',
            epliRetention: data.epli?.retention ?? null
        });
    }
}
