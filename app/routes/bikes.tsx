import { json, redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import type { LoaderFunction, ActionFunction } from '@remix-run/node';

import NavBar from '~/components/NavBar';
import { rate } from '~/services/bike.server';
import { badRequest } from '~/utils/badRequest';
import { cancel, reserve } from '~/services/reservation.server';
import { getUser, requireUser } from '~/services/session.server';

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
    case 'rate':
      const rating = form.get('rating');
      const bikeIdToRate = form.get('bikeId');

      if (typeof rating !== 'string' || typeof bikeIdToRate !== 'string') {
        return badRequest({ formError: 'Form not submitted correctly' });
      }

      await rate(bikeIdToRate, +rating);
      return redirect('/bikes');

    case 'cancel':
      const reservationId = form.get('reservationId');

      if (typeof reservationId !== 'string') {
        throw new Response('Incorrect reservation', { status: 400 });
      }

      await cancel(reservationId);
      return redirect('/bikes');

    case 'reserve':
      const bikeId = form.get('bikeId');
      const start = form.get('startDate');
      const end = form.get('endDate');

      if (typeof bikeId !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
        return badRequest({ formError: 'Form not submitted correctly' });
      }

      await reserve(userId, bikeId, start, end);
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
      <div className="drawer">
        <Outlet />
      </div>
    </>
  );
}
