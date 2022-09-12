import { json } from '@remix-run/node';

import type { LoaderFunction } from '@remix-run/node';

import { DB } from '~/services/db.server';
import { Link, useLoaderData } from '@remix-run/react';
import BikeTable from '~/components/Table';

type LoaderData = {
  bikes: Models.BikeWithRelationships[];
};

export const loader: LoaderFunction = async () => {
  const bikes = await DB.bike.findMany({
    orderBy: { createdAt: 'desc' },
    include: { reservations: true },
  });

  return json<LoaderData>({ bikes });
};

export default function DashboardBikes() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="p-10">
      <div className="flex justify-end mb-5">
        <Link className="btn btn-success" to="new">
          Create a Bike
        </Link>
      </div>
      <BikeTable bikes={data.bikes} />
    </div>
  );
}
