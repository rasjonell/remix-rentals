import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/node';

import BikeCard from '~/components/Bike';
import { DB } from '~/services/db.server';
import { getUser } from '~/services/session.server';

type LoaderData = {
  bikes: Models.BikeWithRelationships[];
  user: Models.UserWithRelationships | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const [user, bikes] = await Promise.all([
    getUser(request),
    DB.bike.findMany({
      where: { available: true },
      include: { reservations: { include: { User: true } } },
    }),
  ]);

  return json<LoaderData>({ user, bikes });
};

export default function BikeIndex() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5 gap-5">
      {data.bikes.map((bike) => (
        <BikeCard key={bike.id} bike={bike} user={data.user} withActions />
      ))}
    </div>
  );
}
