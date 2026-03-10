import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '../footer';
import {UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'gmi-not-found-page',
    template: `
        <section class="flex flex-col items-center mt-128 mb-73 flex-1 pt-60 lg:mt-164 text-center gap-y-32">
            <h1 uiHeading class="text-green-500">
                <span uiHeading variant="italic">Oooops!</span>
                <br />
                Page not found.
            </h1>
            <p class="text-green-900 text-xl max-w-678">
                The page you’re looking for might have been removed, had its name changed, or is temporarily
                unavailable.
            </p>

            <button uiButton type="button" routerLink="../">Back to home</button>
        </section>

        <gmi-footer />
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            height: 100vh;
            margin-top: -82px;
            max-width: calc(var(--spacing) * 1440);

            background-image:
                url(/img/figure/radial-yellow-big.svg), url(/img/figure/circle-lime-big.svg),
                url(/img/figure/radial-lime-2xl.png), url(/img/figure/circle-green-small.svg),
                url(/img/figure/circle-lime-small.svg), url(/img/radial-violet.svg),
                url(/img/figure/circle-mint-xs.svg), url(/img/figure/radial-green-big.svg),
                url(/img/figure/circle-lime-xl.png), linear-gradient(var(--achromatics-grey-forms));
            background-repeat: no-repeat;
            background-position:
                230px 850px,
                130px 855px,
                350px 180px,
                450px 170px,
                230px 50px,
                right 550px top 630px,
                right 520px top 690px,
                right 110px top 350px,
                right 200px top 360px,
                0 0;
        }
    `,
    imports: [Footer, UiHeadingDirective, UiButtonDirective, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPage {}
