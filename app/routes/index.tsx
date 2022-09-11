import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { Bike } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';

import { DB } from '~/services/db.server';

type LoaderData = { bikes: Array<Bike> };

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    bikes: await DB.bike.findMany(),
  };

  return json(data);
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Welcome To Bike Rentals</h1>
      {data.bikes.map((bike) => (
        <h4 key={bike.id}>{bike.model}</h4>
      ))}
    </div>
  );
}
