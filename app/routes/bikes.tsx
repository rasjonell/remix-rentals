import { json, redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import type { LoaderFunction, ActionFunction } from '@remix-run/node';

import NavBar from '~/components/NavBar';
import { getUser, requireUser } from '~/services/session.server';
import { badRequest } from '~/utils/badRequest';
import { DB } from '~/services/db.server';
import { getDateRangeError } from '~/utils/validate';

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export type ActionData = {
  formError?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUser(request);

  const form = await request.formData();
  const intent = form.get('intent');

  switch (intent) {
    case 'cancel':
      const reservationId = form.get('reservationId');

      if (typeof reservationId !== 'string') {
        throw new Response('Incorrect reservation', { status: 400 });
      }

      await DB.reservation.delete({ where: { id: reservationId } });

      return redirect('/bikes');

    case 'reserve':
      const bikeId = form.get('bikeId');
      const start = form.get('startDate');
      const end = form.get('endDate');

      if (typeof bikeId !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
        return badRequest({ formError: 'Form not submitted correctly' });
      }

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

      return redirect('/bikes');
    default:
      throw new Response('Unknown Intent', { status: 400 });
  }
};

export default function BikesIndex() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <NavBar user={data.user} />
      <Outlet />
    </>
  );
}
