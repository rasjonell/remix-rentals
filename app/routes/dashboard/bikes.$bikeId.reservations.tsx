import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/node';

import { DB } from '~/services/db.server';
import BikeReservationsTable from '~/components/BikeReservationsTable';

type LoaderData = {
  bike: Models.BikeWithRelationships;
};

export const loader: LoaderFunction = async ({ params }) => {
  const bike = await DB.bike.findUnique({
    where: { id: params.bikeId },
    include: { reservations: { include: { User: true } } },
  });

  if (!bike) {
    throw new Response('Bike not found', { status: 404 });
  }

  return json<LoaderData>({ bike });
};

export default function BikeReservations() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="p-10">
      <div className="text-center mb-5">
        <h1 className="font-bold text-2xl">Reservations for "{data.bike.model}"</h1>
      </div>
      <BikeReservationsTable bike={data.bike} />
    </div>
  );
}
