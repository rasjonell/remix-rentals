import { useState } from 'react';
import { json } from '@remix-run/node';
import { FaFilter, FaTrash } from 'react-icons/fa';
import { useLoaderData, useNavigate } from '@remix-run/react';

import type { ChangeEventHandler } from 'react';
import type { LoaderFunction } from '@remix-run/node';

import BikeCard from '~/components/Bike';
import { DB } from '~/services/db.server';
import { getUser } from '~/services/session.server';
import DrawerSide from '~/components/Drawer';

type LoaderData = {
  colors: string[];
  bikes: Models.BikeWithRelationships[];
  user: Models.UserWithRelationships | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const model = url.searchParams.get('model') || '';
  const color = url.searchParams.get('color') || '';
  const rating = url.searchParams.get('rating') || '0';
  const location = url.searchParams.get('location') || '';

  const [user, bikes, colors] = await Promise.all([
    getUser(request),
    DB.bike.findMany({
      where: {
        available: true,
        rating: { gte: +rating },
        model: { contains: model },
        color: { contains: color },
        location: { contains: location },
      },
      include: { reservations: { include: { User: true } } },
    }),
    DB.bike.findMany({ select: { color: true } }),
  ]);

  return json<LoaderData>({ user, bikes, colors: colors.map(({ color }) => color) });
};

export default function BikeIndex() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <input id="filter" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="filter" className="btn btn-outline drawer-button ml-10 mt-10 gap-2">
          <FaFilter /> Filter Bikes
        </label>
        {data.bikes.length > 0 ? (
          <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5 gap-5">
            {data.bikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} user={data.user} withActions />
            ))}
          </div>
        ) : (
          <div className="text-center m-auto">
            <h1 className="text-2xl">Looks like there are no bikes to show!</h1>
            <p>Consider Clearing your filters</p>
          </div>
        )}
      </div>
      <DrawerSide colors={data.colors} />
    </>
  );
}
