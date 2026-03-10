import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filledStars' })
export class FilledStarsPipe implements PipeTransform {
    transform(rating: number): number[] {
        return Array.from({ length: rating }, (_, i) => i);
    }
}
