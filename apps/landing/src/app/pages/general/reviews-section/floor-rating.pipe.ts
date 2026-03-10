import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'floorRating' })
export class FloorRatingPipe implements PipeTransform {
    transform(value: string): number {
        return Math.floor(parseFloat(value));
    }
}
