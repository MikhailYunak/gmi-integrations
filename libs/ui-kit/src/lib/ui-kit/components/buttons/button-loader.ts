import {
    booleanAttribute,
    DestroyRef,
    Directive,
    ElementRef,
    inject,
    model,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import { filter, pairwise, ReplaySubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const CLASS_NAME = 'button-indicate-loader';

@Directive({
    selector: '[uiButtonLoader]'
})
export class ButtonLoader implements OnInit, OnDestroy {
    private _loaderStatus$ = new ReplaySubject<boolean | null | undefined>(2);

    private readonly _elementRef = inject(ElementRef);

    private readonly _renderer = inject(Renderer2);

    private readonly _destroyRef = inject(DestroyRef);

    private _loaderNode: Element | undefined;

    readonly loadingStatus = model(false, { alias: 'uiButtonLoader' });

    constructor() {
        const transformedValue = booleanAttribute(this.loadingStatus());
        this._loaderStatus$.next(transformedValue);
    }

    ngOnInit(): void {
        this._loaderStatus$
            .pipe(
                filter((loaderStatus) => typeof loaderStatus === 'boolean'),
                pairwise(),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: ([previousLoaderStatus, nextLoaderStatus]) => {
                    if (!previousLoaderStatus && nextLoaderStatus) {
                        this._makeProgressNode();
                        this._renderer.addClass(this._elementRef.nativeElement, CLASS_NAME);
                    }

                    if (previousLoaderStatus && !nextLoaderStatus) {
                        this._removeProgressNode();
                        this._renderer.removeClass(this._elementRef.nativeElement, CLASS_NAME);
                    }
                }
            });
    }

    ngOnDestroy(): void {
        const newNode = this._renderer.createElement('div');
        newNode.className = 'ui-button-loader';
        this._renderer.appendChild(this._elementRef.nativeElement, newNode);
        this._loaderNode = newNode;
    }

    private _makeProgressNode(): void {
        const newNode = this._renderer.createElement('div');
        newNode.className = 'ui-button-loader';
        this._renderer.appendChild(this._elementRef.nativeElement, newNode);
        this._loaderNode = newNode;
    }

    private _removeProgressNode(): void {
        if (this._loaderNode) {
            this._renderer.removeChild(this._elementRef.nativeElement, this._loaderNode);
            this._loaderNode = undefined;
        }
    }
}
