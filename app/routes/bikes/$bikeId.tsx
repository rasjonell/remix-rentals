import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/node';

import { DB } from '~/services/db.server';

type LoaderData = { bike: Models.BikeWithRelationships };

export const loader: LoaderFunction = async ({ params }) => {
  const bike = await DB.bike.findUnique({
    where: { id: params.bikeId },
    include: { reservations: { include: { User: true } } },
  });

  if (!bike) throw new Error('Bike not found');

  return json<LoaderData>({ bike });
};

export default function BikeRoute() {
  const { bike } = useLoaderData<LoaderData>();

  return (
    <div>
      <h2>{bike.model}</h2>
      <h3>{bike.reservations.length} reservations</h3>
    </div>
  );
}
