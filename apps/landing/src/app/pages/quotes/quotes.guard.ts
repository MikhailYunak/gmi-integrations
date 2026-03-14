import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UiSnackbarService } from '@gmi-integrations/ui-kit';
import { GlobalState } from '../../state/global-state';

export const quotesGuard: CanActivateFn = () => {
    const state = inject(GlobalState);
    const router = inject(Router);
    const snackbar = inject(UiSnackbarService);

    if (state.quoteResult() !== null) {
        return true;
    }

    snackbar.warning(
        'You have already received a quote. To get a new one, please complete all steps from the beginning or edit them.'
    );

    return router.createUrlTree(['/']);
};
