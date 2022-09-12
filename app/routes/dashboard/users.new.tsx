import { redirect } from '@remix-run/node';

import type { ActionFunction } from '@remix-run/node';

import { badRequest } from '~/utils/badRequest';
import { validateMinimumLength } from '~/utils/validate';
import { Form, useActionData } from '@remix-run/react';
import { register } from '~/services/session.server';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields: {
    username: string;
    password: string;
    isManager: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
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
    username: validateMinimumLength(3, username),
    password: validateMinimumLength(6, password),
  };

  const isManagerBool = isManager === 'on';

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: { username, password, isManager } });
  }

  const user = await register({ username, password, isManager: isManagerBool });
  if (!user) {
    return badRequest({
      fields: { username, password },
      formError: 'Something went wrong when trying to create a new user',
    });
  }

  return redirect('/dashboard/users');
};

export default function NewBikeRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="p-5 lg:p-20 justify-center">
      <h1 className="text-2xl font-bold text-center">Create A User</h1>
      <Form method="post" className="flex flex-col items-center">
        <div className="card bg-base-100 shadow-lg w-full xs:w-full sm:w-full md:w-3/4 lg:w-1/2">
          <div className="card-body">
            <div className="card-title">
              <div className="flex flex-col">
                <input
                  required
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input input-ghost w-full"
                  defaultValue={actionData?.fields?.username}
                  aria-invalid={Boolean(actionData?.fieldErrors?.username) || undefined}
                  aria-errormessage={
                    actionData?.fieldErrors?.username ? 'username-error' : undefined
                  }
                />
                {actionData?.fieldErrors?.username ? (
                  <p className="font-light text-sm text-red-600" role="alert" id="model-error">
                    Username {actionData.fieldErrors.username}
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
                  placeholder="Password"
                  className="input input-ghost w-full"
                  defaultValue={actionData?.fields?.password}
                  aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
                  aria-errormessage={
                    actionData?.fieldErrors?.password ? 'location-error' : undefined
                  }
                />
              </div>
              {actionData?.fieldErrors?.password ? (
                <p className="font-light text-sm text-red-600" role="alert" id="location-error">
                  Password {actionData.fieldErrors.password}
                </p>
              ) : null}
            </div>

            <div className="card-actions justify-between items-center mt-2">
              <label className="flex items-center cursor-pointer select-none mt-5">
                <span>Is Manager?</span>
                <input
                  type="checkbox"
                  name="isManager"
                  className="ml-2 checkbox checkbox-primary"
                  defaultChecked={actionData?.fields?.isManager === 'on'}
                />
              </label>

              <button className="btn text-white" type="submit">
                Create
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
