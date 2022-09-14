import { DB } from './db.server';
import { badRequest } from '~/utils/badRequest';
import { getDateRangeError } from '~/utils/validate';

export async function cancel(reservationId: string) {
  await DB.reservation.delete({ where: { id: reservationId } });
}

export async function reserve(userId: string, bikeId: string, start: string, end: string) {
  const bike = await DB.bike.findUnique({
    where: { id: bikeId },
    include: { reservations: true },
  });
  if (!bike) {
    throw new Response('Bike does not exist', { status: 404 });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  const dateRangeError = getDateRangeError(start, end, bike.reservations);
  if (dateRangeError) {
    return badRequest({ formError: dateRangeError });
  }

  const reservationData = { startDate, endDate, userId, bikeId: bike.id };
  await DB.reservation.create({ data: reservationData });
}
