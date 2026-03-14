import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { UiButtonDirective, UiHeader, UiSnackbarComponent} from '@gmi-integrations/ui-kit';
import { HamburgerButton, LanguageSwitcher, Logo, MobileMenu, NavMenu } from '@gmi-integrations/shared';

@Component({
    selector: 'gmi-root',
    template: `
        @let _mobileMenuOpen = mobileMenuOpen();
        @let _isGeneral = isGeneralRoute();
        <ui-header class="sticky top-0">
            <ng-container slot="start"><gmi-logo /></ng-container>

            @if (_isGeneral) {
                <ng-container slot="center"><gmi-nav-menu /></ng-container>
            }

            <ng-container slot="end">
                <div class="flex gap-x-16 lg:gap-x-24">
                    <gmi-language-switcher />

                    @if (_isGeneral) {
                        <button
                            class="hidden lg:inline-flex"
                            type="button"
                            uiButton="primary"
                            [routerLink]="['/steps']"
                        >
                            Get insurance
                        </button>

                        <gmi-hamburger-button
                            #hamburgerButtonRef="hamburger-button"
                            class="hamburger-btn lg:hidden"
                            [isOpen]="_mobileMenuOpen"
                            (menuOpen)="_menuOpenChanged()"
                        >
                            <span close class="hb-icon material-symbols-outlined" translate="no" aria-hidden="true">
                                close
                            </span>
                            <span open class="hb-bar hb-bar--long"></span>
                            <span open class="hb-bar"></span>
                            <span open class="hb-bar"></span>
                        </gmi-hamburger-button>
                    }
                </div>
            </ng-container>
        </ui-header>

        @if (_mobileMenuOpen) {
            <gmi-mobile-menu #mobileMenu (close)="mobileMenuOpen.set(false)" />
        }

        <router-outlet />
        <ui-snackbar />
    `,
    styleUrl: 'app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        RouterOutlet,
        UiHeader,
        UiButtonDirective,
        LanguageSwitcher,
        Logo,
        NavMenu,
        MobileMenu,
        HamburgerButton,
        UiSnackbarComponent
    ]
})
export class App {
    readonly mobileMenuOpen = signal(false);
    private readonly mobileMenu = viewChild<MobileMenu>('mobileMenu');

    private readonly router = inject(Router);

    readonly isGeneralRoute = toSignal(
        this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            map(() => this.router.url === '/'),
            startWith(this.router.url === '/')
        )
    );

    protected _menuOpenChanged(): void {
        if (this.mobileMenuOpen()) {
            this.mobileMenu()?.handleClose();
        } else {
            this.mobileMenuOpen.set(true);
        }
    }
}
