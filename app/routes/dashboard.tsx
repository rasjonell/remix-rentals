import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/node';
import type { getUser } from '~/services/session.server';

import NavBar from '~/components/NavBar';
import { requireManager } from '~/services/session.server';

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireManager(request);

  return json({ user });
};

export default function DashboardIndex() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <NavBar user={data.user} />
      <Outlet />
    </>
  );
}
