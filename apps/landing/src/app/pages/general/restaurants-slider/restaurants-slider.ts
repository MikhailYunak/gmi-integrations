import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { SwiperSlider } from '@gmi-integrations/shared';

interface Restaurant {
    name: string;
    description: string;
    imageSrc: string;
}

const RESTAURANTS: Restaurant[] = [
    { name: 'LIQUE', description: 'Waterfront restaurant & Lounge, Miami', imageSrc: '/img/temp/restaurant-image.jpg' },
    { name: 'BUDDHA-BAR', description: 'Restaurant, New York', imageSrc: '/img/temp/restaurant-image-2.jpg' },
    { name: 'NEYA', description: 'Restaurant, Miami', imageSrc: '/img/temp/restaurant-image.jpg' },
    { name: 'HUBBLE BUBBLE', description: 'Restaurant, Miami', imageSrc: '/img/temp/restaurant-image-2.jpg' },
    { name: 'BAGATELLE', description: 'Restaurant & Lounge, Miami', imageSrc: '/img/temp/restaurant-image.jpg' },
];

@Component({
    selector: 'gmi-restaurants-slider',
    templateUrl: './restaurants-slider.html',
    styleUrl: './restaurants-slider.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SwiperSlider, UiHeadingDirective, NgOptimizedImage]
})
export class RestaurantsSlider {
    protected readonly _restaurants: unknown[] = RESTAURANTS;

    protected _asRestaurant(v: unknown): Restaurant {
        return v as Restaurant;
    }
}
