import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/node';

import { DB } from '~/services/db.server';
import UserReservationTable from '~/components/UserReservationsTable';

type LoaderData = {
  user: Models.UserWithRelationships;
};

export const loader: LoaderFunction = async ({ params }) => {
  const user = await DB.user.findUnique({
    where: { id: params.userId },
    include: { reservations: { include: { Bike: true } } },
  });

  if (!user) {
    throw new Response('User not found', { status: 404 });
  }

  return json<LoaderData>({ user });
};

export default function BikeReservations() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="p-10">
      <div className="text-center mb-5">
        <h1 className="font-bold text-2xl">Reservations by "{data.user.username}"</h1>
      </div>
      <UserReservationTable user={data.user} />
    </div>
  );
}
