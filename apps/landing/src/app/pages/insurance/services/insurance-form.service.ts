import {
    computed,
    effect,
    inject,
    Injectable,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { merge, switchMap } from 'rxjs';
import { InsuranceApiService, isConflictError } from './insurance-api.service';
import { QuoteApplicationStatus, StepOneDto } from '../models/insurance.models';

const QUOTE_UUID_KEY = 'quoteUuid';

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
    CANCELLED: ['/insurance', 'general-information'],
};

@Injectable()
export class InsuranceFormService {
    private readonly _fb = inject(FormBuilder);

    private readonly _api = inject(InsuranceApiService);

    private readonly _router = inject(Router);

    // ── Form ─────────────────────────────────────────────────────────────────

    readonly form = this._fb.group({
        generalInfo: this._fb.nonNullable.group({
            fullName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        }),
        businessInfo: this._fb.group({
            legalBusinessName: this._fb.nonNullable.control('', [Validators.required]),
            hasDba: this._fb.nonNullable.control(false),
            dba: this._fb.nonNullable.control(''),
            businessState: this._fb.control<string | null>(null, [Validators.required]),
            businessStartDate: this._fb.nonNullable.control('', [
                Validators.required,
                Validators.pattern(/^\d{2}\/\d{4}$/),
            ]),
            numEmployees: this._fb.nonNullable.control('1', [Validators.required]),
            businessZipCode: this._fb.nonNullable.control('', [
                Validators.required,
                Validators.pattern(/^\d{5}$/),
            ]),
        }),
        hasPreviousClaims: this._fb.control<boolean | null>(null, [Validators.required]),
        previousClaims: this._fb.array<FormGroup<ClaimGroup>>([]),
    });

    // ── Reactive signals ──────────────────────────────────────────────────────

    readonly formChange = toSignal(
        merge(this.form.statusChanges, this.form.valueChanges),
        { initialValue: null },
    );

    private readonly _hasDba = toSignal(
        this.form.controls.businessInfo.controls.hasDba.valueChanges,
        { initialValue: false },
    );

    private readonly _hasClaims = toSignal(
        this.form.controls.hasPreviousClaims.valueChanges,
        { initialValue: null as boolean | null },
    );

    readonly showDba = computed(() => this._hasDba());

    readonly showClaimsSection = computed(() => this._hasClaims() === true);

    /** Signal-driven list of claim FormGroups for template `@for` rendering. */
    readonly claims = signal<FormGroup<ClaimGroup>[]>([]);

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
    }

    // ── Claims helpers ────────────────────────────────────────────────────────

    addClaim(): void {
        this._pushClaim();
    }

    removeClaim(index: number): void {
        this.form.controls.previousClaims.removeAt(index);
        this.claims.update((arr) => arr.filter((_, i) => i !== index));
    }

    // ── Submit flow ───────────────────────────────────────────────────────────

    submitStepOne(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const dto = this._buildDto();
        const uuid = localStorage.getItem(QUOTE_UUID_KEY);
        this.isLoading.set(true);

        const request$ = uuid
            ? this._api.updateStepOne(uuid, dto)
            : this._api.createApplication(dto);

        request$.subscribe({
            next: (app) => {
                localStorage.setItem(QUOTE_UUID_KEY, app.uuid);
                this.isLoading.set(false);
                this._router.navigate(STATUS_ROUTE[app.status] ?? STATUS_ROUTE.STEP_TWO);
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading.set(false);
                if (isConflictError(err)) {
                    this.conflictUuid.set(err.error.activeQuoteUuid);
                }
            },
        });
    }

    /** User chose "Continue existing application" in the conflict dialog. */
    continueExisting(): void {
        const uuid = this.conflictUuid();
        if (!uuid) {return;}

        this.isLoading.set(true);
        this._api.getApplication(uuid).subscribe({
            next: (app) => {
                localStorage.setItem(QUOTE_UUID_KEY, app.uuid);
                this.conflictUuid.set(null);
                this.isLoading.set(false);
                this._router.navigate(STATUS_ROUTE[app.status] ?? STATUS_ROUTE.STEP_ONE);
            },
            error: () => {
                this.isLoading.set(false);
            },
        });
    }

    /** User chose "Start over" in the conflict dialog. */
    startOver(): void {
        const uuid = this.conflictUuid();
        if (!uuid) {return;}

        this.isLoading.set(true);
        const dto = this._buildDto();

        this._api
            .cancelApplication(uuid)
            .pipe(switchMap(() => this._api.createApplication(dto)))
            .subscribe({
                next: (app) => {
                    localStorage.setItem(QUOTE_UUID_KEY, app.uuid);
                    this.conflictUuid.set(null);
                    this.isLoading.set(false);
                    this._router.navigate(STATUS_ROUTE.STEP_TWO);
                },
                error: () => {
                    this.isLoading.set(false);
                },
            });
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private _pushClaim(): void {
        const group = this._fb.group({
            claimAmount: this._fb.nonNullable.control('', [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            claimDescription: this._fb.nonNullable.control('', [Validators.required]),
        }) as FormGroup<ClaimGroup>;

        this.form.controls.previousClaims.push(group);
        this.claims.update((arr) => [...arr, group]);
    }

    private _buildDto(): StepOneDto {
        const raw = this.form.getRawValue();

        return {
            generalInfo: {
                fullName: raw.generalInfo.fullName,
                email: raw.generalInfo.email,
                phone: `+1${raw.generalInfo.phone}`,
            },
            businessInfo: {
                legalBusinessName: raw.businessInfo.legalBusinessName,
                ...(raw.businessInfo.hasDba && { dba: raw.businessInfo.dba }),
                businessState: raw.businessInfo.businessState ?? '',
                businessStartDate: this._toIsoDate(raw.businessInfo.businessStartDate),
                numEmployees: Number(raw.businessInfo.numEmployees),
                businessZipCode: raw.businessInfo.businessZipCode,
            },
            hasPreviousClaims: raw.hasPreviousClaims ?? false,
            ...(raw.hasPreviousClaims && {
                previousClaims: raw.previousClaims.map((c) => ({
                    claimAmount: Number(c.claimAmount),
                    claimDescription: c.claimDescription,
                })),
            }),
        };
    }

    /** Converts UI "MM/YYYY" → ISO "YYYY-MM-01" */
    private _toIsoDate(value: string): string {
        const [mm, yyyy] = value.split('/');
        return `${yyyy}-${mm}-01`;
    }
}
