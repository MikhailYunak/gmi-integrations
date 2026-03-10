import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormGroup } from '@angular/forms';

export type ValidationErrorBody = {
    status: 422;
    errors: Record<string, unknown>;
};

export function isValidationError(
    error: HttpErrorResponse
): error is HttpErrorResponse & { error: ValidationErrorBody } {
    return error.status === 422 && !!error.error?.errors;
}

export function applyServerErrors(errors: Record<string, unknown>, form: FormGroup | FormArray): void {
    for (const [key, value] of Object.entries(errors)) {
        const ctrl = (form as FormGroup).get(key);
        if (!ctrl) {
            continue;
        }

        if (typeof value === 'string') {
            ctrl.setErrors({ serverError: value });
            ctrl.markAsTouched();
        } else if (Array.isArray(value) && ctrl instanceof FormArray) {
            value.forEach((itemErr, i) => {
                const child = ctrl.at(i);
                if (child instanceof FormGroup && itemErr && typeof itemErr === 'object') {
                    applyServerErrors(itemErr as Record<string, unknown>, child);
                }
            });
        } else if (value && typeof value === 'object' && ctrl instanceof FormGroup) {
            applyServerErrors(value as Record<string, unknown>, ctrl);
        }
    }
}
