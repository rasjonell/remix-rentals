import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/node';

import NavBar from '~/components/NavBar';
import { getUser } from '~/services/session.server';

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json({ user });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <NavBar user={data.user} />
      <Outlet />
    </>
  );
}
