import { areIntervalsOverlapping, compareAsc, isPast } from 'date-fns';

import type { Reservation } from '@prisma/client';
import type { SerializeFrom } from '@remix-run/node';

export function validateMinimumLength(len: number, content: unknown) {
  if (!(typeof content === 'string' && content.length >= len)) {
    return `must be at least ${len} characters long`;
  }
}

export function getDateRangeError(
  start: string,
  end: string,
  reservations: Reservation[] | SerializeFrom<Reservation>[],
): string | undefined {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isPast(startDate) || isPast(endDate) || compareAsc(startDate, endDate) !== -1) {
    return 'Invalid Date Range';
  }

  const overlaps = reservations
    .map((reservation) => ({
      start: new Date(reservation.startDate),
      end: new Date(reservation.endDate),
    }))
    .some((interval) =>
      areIntervalsOverlapping(interval, { start: startDate, end: endDate }, { inclusive: true }),
    );

  if (overlaps) {
    return 'Selected date range overlaps with another reservation';
  }
}
