import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/node';

import BikeCard from '~/components/Bike';
import { DB } from '~/services/db.server';

type LoaderData = {
  bikes: Models.BikeWithRelationships[];
};

export const loader: LoaderFunction = async () => {
  const bikes = await DB.bike.findMany({
    where: { available: true },
    include: { reservations: true },
  });

  return json<LoaderData>({ bikes });
};

export default function BikeIndex() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5 gap-5">
      {data.bikes.map((bike) => (
        <BikeCard key={bike.id} bike={bike} />
      ))}
    </div>
  );
}
