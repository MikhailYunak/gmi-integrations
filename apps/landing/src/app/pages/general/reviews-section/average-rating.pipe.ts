import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'averageRating' })
export class AverageRatingPipe implements PipeTransform {
    transform(ratings: { rating: string }[]): string {
        if (!ratings?.length) {
            return '0';
        }
        const sum = ratings.reduce((acc, r) => acc + parseFloat(r.rating), 0);
        return (sum / ratings.length).toFixed(1);
    }
}
