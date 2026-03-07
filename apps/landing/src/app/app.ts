import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiButtonDirective, UiHeader } from '@gmi-integrations/ui-kit';
import { HamburgerButton, LanguageSwitcher, Logo, MobileMenu, NavMenu } from '@gmi-integrations/shared';

@Component({
    selector: 'gmi-root',
    template: `
        @let _mobileMenuOpen = mobileMenuOpen();
        <main>
            <ui-header class="sticky top-6 md:top-20 mx-6 md:mx-48 z-50">
                <ng-container slot="start"><gmi-logo /></ng-container>

                <ng-container slot="center"><gmi-nav-menu /></ng-container>

                <ng-container slot="end">
                    <!--                    <div class="header-end-desktop">-->
                    <!--                        <gmi-language-switcher />-->
                    <!--                        <button type="button" uiButton="primary">Get insurance</button>-->
                    <!--                    </div>-->

                    <div class="flex gap-x-16 md:gap-x-24">
                        <gmi-language-switcher />

                        <button class="hidden md:inline-flex" type="button" uiButton="primary">Get insurance</button>

                        <gmi-hamburger-button
                            #hamburgerButtonRef="hamburger-button"
                            class="hamburger-btn md:hidden"
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
                    </div>
                </ng-container>
            </ui-header>

            @if (_mobileMenuOpen) {
                <gmi-mobile-menu (close)="mobileMenuOpen.set(false)" />
            }

            <router-outlet />
        </main>
    `,
    styleUrl: 'app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, UiHeader, UiButtonDirective, LanguageSwitcher, Logo, NavMenu, MobileMenu, HamburgerButton]
})
export class App {
    readonly mobileMenuOpen = signal(false);

    protected _menuOpenChanged(): void {
        this.mobileMenuOpen.update((v) => !v);
    }
}
