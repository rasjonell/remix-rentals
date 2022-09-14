import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import type { User } from '@prisma/client';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';

import { DB } from '~/services/db.server';
import { badRequest } from '~/utils/badRequest';
import { validateMinimumLength } from '~/utils/validate';
import { hashPassword } from '~/services/session.server';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
    isManager: string | undefined;
  };
  fields: {
    username: string;
    password: string;
    isManager: string;
  };
};

type LoaderData = {
  user: User;
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await DB.user.findUnique({
    where: { id: params.userId },
  });

  if (!user) {
    throw new Response('User with the given ID does not exist', { status: 404 });
  }

  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const isManager = form.get('isManager');

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !['object', 'string'].includes(typeof isManager)
  ) {
    return badRequest({ formError: 'Form not submitted correctly' });
  }

  const fieldErrors: ActionData['fieldErrors'] = {
    isManager: undefined,
    username: validateMinimumLength(3, username),
    password: validateMinimumLength(6, password),
  };

  const isManagerBool = isManager === 'on';
  const data = { username, password, isManager };
  const passwordHash = await hashPassword(password);

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: data });
  }

  await DB.user.update({
    where: { id: user.id },
    data: { username, passwordHash, isManager: isManagerBool },
  });

  return redirect(`/dashboard/users`);
};

export const loader: LoaderFunction = async ({ params }) => {
  const user = await DB.user.findUnique({
    where: { id: params.userId },
  });

  if (!user) {
    throw new Response("Couldn't find a user with the given id", { status: 404 });
  }

  return json<LoaderData>({ user });
};

export default function NewUserRoute() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const getError = (name: keyof ActionData['fields']) => {
    return actionData?.fieldErrors?.[name];
  };

  return (
    <div className="p-5 lg:p-20 justify-center">
      <h1 className="text-2xl font-bold text-center">Edit User</h1>
      <Form method="post" className="flex flex-col items-center">
        <div className="card bg-base-100 shadow-lg w-full xs:w-full sm:w-full md:w-3/4 lg:w-1/2">
          <div className="card-body">
            <div className="card-title">
              <div className="flex flex-col">
                <input
                  required
                  type="text"
                  name="username"
                  placeholder="username"
                  className="input input-ghost w-full"
                  aria-invalid={Boolean(getError('username')) || undefined}
                  defaultValue={actionData?.fields?.username || loaderData.user.username}
                  aria-errormessage={getError('username') ? 'username-error' : undefined}
                />
                {getError('username') ? (
                  <p className="font-light text-sm text-red-600" role="alert" id="model-error">
                    Username {getError('username')}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="password"
                  className="input input-ghost w-full"
                  defaultValue={actionData?.fields?.password}
                  aria-invalid={Boolean(getError('password')) || undefined}
                  aria-errormessage={getError('password') ? 'password-error' : undefined}
                />
              </div>
              {getError('password') ? (
                <p className="font-light text-sm text-red-600" role="alert" id="location-error">
                  Password {getError('password')}
                </p>
              ) : null}
            </div>

            <div className="card-actions justify-between items-center mt-2">
              <label className="flex items-center cursor-pointer select-none mt-5">
                <span>Is Manager</span>
                <input
                  type="checkbox"
                  name="isManager"
                  className="ml-2 checkbox checkbox-primary"
                  defaultChecked={!!(actionData?.fields?.isManager ?? loaderData.user.isManager)}
                />
              </label>
              <button className="btn text-white" type="submit">
                Edit
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
