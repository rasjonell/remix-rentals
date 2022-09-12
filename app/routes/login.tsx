import { badRequest } from '~/utils/badRequest';
import { Form, useActionData, useSearchParams } from '@remix-run/react';

import { DB } from '~/services/db.server';
import { validateMinimumLength } from '~/utils/validate';
import { createUserSession, login, register } from '~/services/session.server';

import type { ActionFunction } from '@remix-run/node';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
    loginType: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const loginType = form.get('loginType');

  const redirectTo = (form.get('redirectTo') || '/bikes') as string;

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof loginType !== 'string'
  ) {
    return badRequest({ formError: 'Form not submitted correctly' });
  }

  const fields = { username, password, loginType };
  const fieldErrors = {
    username: validateMinimumLength(3, username),
    password: validateMinimumLength(6, password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case 'login': {
      const user = await login({ username, password });
      if (!user) {
        return badRequest({ fields, formError: 'Incorrect Credentials' });
      }

      return createUserSession(user.id, redirectTo);
    }

    case 'register': {
      const userExists = await DB.user.findFirst({ where: { username } });

      if (userExists) {
        return badRequest({
          fields,
          formError: `User with username: "${username}" already exists`,
        });
      }

      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: 'Something went wrong when trying to create a new user',
        });
      }

      return createUserSession(user.id, redirectTo);
    }

    default:
      return badRequest({
        fields,
        formError: 'Invalid Login Type',
      });
  }
};

export default function LoginRoute() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <Form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />

          <div className="form-control w-screen lg:px-80 md:px-15 sm:px-5 xs:px-5">
            <label className="label">
              <span className="label-text">What's your username</span>
              <span className="label-text-alt">required</span>
            </label>
            <input
              required
              type="text"
              name="username"
              className="input input-bordered"
              placeholder="Type your username here"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fields?.username)}
              aria-errormessage={actionData?.fieldErrors?.username ? 'username-error' : undefined}
            />
            {actionData?.fieldErrors?.username ? (
              <p id="username-error" className="font-light text-red-500">
                Username {actionData.fieldErrors.username}
              </p>
            ) : null}

            <label className="label">
              <span className="label-text">What's your password</span>
              <span className="label-text-alt">required</span>
            </label>
            <input
              required
              type="password"
              name="password"
              className="input input-bordered"
              placeholder="Type your password here"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fields?.password)}
              aria-errormessage={actionData?.fieldErrors?.password ? 'password-error' : undefined}
            />
            {actionData?.fieldErrors?.password ? (
              <p id="username-error" className="font-light text-red-500">
                Password {actionData.fieldErrors.password}
              </p>
            ) : null}

            <div className="flex flex-row w-full justify-center mt-5">
              <div className="flex flex-row justify-around w-1/2">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-3">Sign In</span>
                    <input
                      type="radio"
                      value="login"
                      name="loginType"
                      className="radio checked:bg-red-500"
                      defaultChecked={
                        !actionData?.fields?.loginType || actionData?.fields?.loginType === 'login'
                      }
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-3">Create an Account</span>
                    <input
                      type="radio"
                      value="register"
                      name="loginType"
                      className="radio checked:bg-blue-500"
                      defaultChecked={actionData?.fields?.loginType === 'register'}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="text-center mt-5">
              {actionData?.formError ? (
                <p role="alert" className="text-red-500 font-light">
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <div className="flex flex-row-reverse mt-5">
              <button type="submit" className="btn w-full">
                Login
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
