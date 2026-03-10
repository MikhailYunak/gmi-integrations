import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'emptyStars' })
export class EmptyStarsPipe implements PipeTransform {
    transform(rating: number, max = 5): number[] {
        return Array.from({ length: max - rating }, (_, i) => i);
    }
}
