import { json, redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import type { LoaderFunction, ActionFunction } from '@remix-run/node';

import NavBar from '~/components/NavBar';
import { getUser, requireUser } from '~/services/session.server';
import { badRequest } from '~/utils/badRequest';
import { DB } from '~/services/db.server';

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUser(request);

  const form = await request.formData();
  const bikeId = form.get('bikeId');
  const start = form.get('startDate');
  const end = form.get('endDate');

  if (typeof bikeId !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
    return badRequest({ formError: 'Form not submitted correctly' });
  }

  const bike = await DB.bike.findUnique({ where: { id: bikeId } });
  if (!bike) {
    throw new Response('Bike does not exist', { status: 404 });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (new Date(endDate) <= new Date(startDate)) {
    return badRequest({ formError: 'End Date must be later than the Start Date' });
  }

  const reservationData = { startDate, endDate, userId, bikeId: bike.id };
  await DB.reservation.create({ data: reservationData });

  return redirect('/bikes');
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
