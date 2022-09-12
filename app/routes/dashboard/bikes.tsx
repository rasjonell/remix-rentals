import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import type { LoaderFunction, ActionFunction } from '@remix-run/node';

import { DB } from '~/services/db.server';
import BikesTable from '~/components/BikesTable';

type LoaderData = {
  bikes: Models.BikeWithRelationships[];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const bikeId = form.get('bikeId');

  if (typeof bikeId !== 'string') {
    throw new Response('Invalid Bike ID', { status: 400 });
  }

  await DB.bike.delete({ where: { id: bikeId } });

  return redirect('');
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
      <BikesTable bikes={data.bikes} />
    </div>
  );
}
