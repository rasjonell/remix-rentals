import { redirect } from '@remix-run/node';
import { FaLocationArrow } from 'react-icons/fa';

import type { ActionFunction } from '@remix-run/node';

import { badRequest } from '~/utils/badRequest';
import { validateMinimumLength } from '~/utils/validate';
import { DB } from '~/services/db.server';
import { Form, useActionData } from '@remix-run/react';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    model: string | undefined;
    location: string | undefined;
    available: string | undefined;
    color: string | undefined;
  };
  fields: {
    model: string;
    location: string;
    available: string;
    color: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const model = form.get('model');
  const location = form.get('location');
  const availability = form.get('available');
  const color = form.get('color');

  if (
    typeof model !== 'string' ||
    typeof location !== 'string' ||
    !['object', 'string'].includes(typeof availability) ||
    typeof color !== 'string'
  ) {
    return badRequest({ formError: 'Form not submitted correctly' });
  }

  const fieldErrors: ActionData['fieldErrors'] = {
    model: validateMinimumLength(3, model),
    location: validateMinimumLength(5, location),
    color: undefined,
    available: undefined,
  };

  const available = availability === 'on';
  const data = { model, location, available, color, rating: 0 };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: data });
  }

  await DB.bike.create({ data });

  return redirect(`/dashboard/bikes`);
};

export default function NewBikeRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="p-5 lg:p-20 justify-center">
      <h1 className="text-2xl font-bold text-center">Create A Bike</h1>
      <Form method="post" className="flex flex-col items-center">
        <div className="card bg-base-100 shadow-lg w-full xs:w-full sm:w-full md:w-3/4 lg:w-1/2">
          <div className="card-body">
            <div className="card-title">
              <div className="flex flex-col">
                <input
                  required
                  type="text"
                  name="model"
                  placeholder="Bike Model"
                  className="input input-ghost w-full"
                  defaultValue={actionData?.fields?.model}
                  aria-invalid={Boolean(actionData?.fieldErrors?.model) || undefined}
                  aria-errormessage={actionData?.fieldErrors?.model ? 'model-error' : undefined}
                />
                {actionData?.fieldErrors?.model ? (
                  <p className="font-light text-sm text-red-600" role="alert" id="model-error">
                    Model {actionData.fieldErrors.model}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <FaLocationArrow className="mr-2" />
                <input
                  required
                  type="text"
                  name="location"
                  placeholder="Bike Location"
                  className="input input-ghost w-full"
                  defaultValue={actionData?.fields?.location}
                  aria-invalid={Boolean(actionData?.fieldErrors?.location) || undefined}
                  aria-errormessage={
                    actionData?.fieldErrors?.location ? 'location-error' : undefined
                  }
                />
              </div>
              {actionData?.fieldErrors?.location ? (
                <p className="font-light text-sm text-red-600" role="alert" id="location-error">
                  Location {actionData.fieldErrors.location}
                </p>
              ) : null}
            </div>
            <label className="flex items-center cursor-pointer select-none mt-5">
              <span>Available For Reservation?</span>
              <input
                type="checkbox"
                name="available"
                className="ml-2 checkbox checkbox-primary"
                defaultChecked={actionData?.fields?.available === 'on'}
              />
            </label>
            <div className="card-actions justify-between items-center mt-2">
              <label className="flex items-center cursor-pointer select-none">
                Bike Color
                <input
                  type="color"
                  name="color"
                  className="ml-2 rounded-full w-6 h-6"
                  defaultValue={actionData?.fields?.color ?? '#ff0000'}
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
