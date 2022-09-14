import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import type { LoaderFunction, ActionFunction } from '@remix-run/node';

import { DB } from '~/services/db.server';
import UsersTable from '~/components/UsersTable';

type LoaderData = {
  users: Models.UserWithRelationships[];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const userId = form.get('userId');

  if (typeof userId !== 'string') {
    throw new Response('Invalid User ID', { status: 400 });
  }

  await DB.user.delete({ where: { id: userId } });

  return redirect('/dashboard/users');
};

export const loader: LoaderFunction = async () => {
  const users = await DB.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { reservations: { include: { Bike: true } } },
  });

  return json<LoaderData>({ users });
};

export default function DashboardUsers() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="p-10">
      <div className="flex justify-end mb-5">
        <Link className="btn btn-success" to="new">
          Create a User
        </Link>
      </div>
      <UsersTable users={data.users} />
    </div>
  );
}
