import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '../footer';
import {UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'gmi-not-found-page',
    template: `
        <section class="not-found-page-figure">
            <section class="flex flex-col w-full items-center mt-128 mb-73 flex-1 pt-60 lg:mt-164 text-center gap-y-32">
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
        </section>
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 100dvh;
            background-image: linear-gradient(var(--achromatics-grey-forms));

            .not-found-page-figure {
                display: flex;
                flex-direction: column;
                flex: 1;
                width: 100%;
                margin-inline: auto;
                max-width: calc(var(--spacing) * 1440);
                background-image:
                    url(/img/figure/radial-yellow-big.svg), url(/img/figure/circle-lime-big.svg),
                    url(/img/figure/radial-lime-2xl.png), url(/img/figure/circle-green-small.svg),
                    url(/img/figure/circle-lime-small.svg), url(/img/radial-violet.svg),
                    url(/img/figure/circle-mint-xs.svg), url(/img/figure/radial-green-big.svg),
                    url(/img/figure/circle-lime-xl.png);
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
                    right 200px top 360px;
            }
        }
    `,
    imports: [Footer, UiHeadingDirective, UiButtonDirective, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPage {}
