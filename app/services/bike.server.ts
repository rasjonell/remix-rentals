import { DB } from './db.server';

export async function rate(bikeId: string, rating: number) {
  const bikeToRate = await DB.bike.findUnique({ where: { id: bikeId } });
  if (!bikeToRate) {
    throw new Response('Bike not found', { status: 404 });
  }

  const numRating = +rating;
  const newRatingCount = bikeToRate.ratingCount + 1;
  const newRating = bikeToRate.ratingCount === 0 ? numRating : (bikeToRate.rating + numRating) / 2;

  await DB.bike.update({
    where: { id: bikeId },
    data: { rating: newRating > 5 ? 5 : newRating, ratingCount: newRatingCount },
  });
}
