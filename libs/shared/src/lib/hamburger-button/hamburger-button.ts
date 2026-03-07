import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'gmi-hamburger-button',
    template: `
        @let _isOpen = isOpen();
        <div class="hamburger-gradient"></div>
        <button
            #btn
            type="button"
            class="hamburger-inner"
            [attr.aria-label]="_isOpen ? 'Close menu' : 'Open menu'"
            (click)="menuOpen.emit()"
        >
            @if (_isOpen) {
                <ng-content select="[close]" />
            } @else {
                <ng-content select="[open]" />
            }
        </button>
    `,
    styleUrl: 'hamburger-button.scss',
    exportAs: 'hamburger-button',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'hamburger-button'
    }
})
export class HamburgerButton {
    readonly isOpen = input(false);

    readonly menuOpen = output<void>();

    private readonly _btn = viewChild.required<ElementRef<HTMLButtonElement>>('btn');

    focus(): void {
        this._btn().nativeElement.focus();
    }
}
