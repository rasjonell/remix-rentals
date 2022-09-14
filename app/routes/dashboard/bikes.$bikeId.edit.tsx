import { json, redirect } from '@remix-run/node';
import { FaLocationArrow } from 'react-icons/fa';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import type { Bike } from '@prisma/client';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';

import { DB } from '~/services/db.server';
import { badRequest } from '~/utils/badRequest';
import { validateMinimumLength } from '~/utils/validate';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    color: string | undefined;
    model: string | undefined;
    location: string | undefined;
    available: string | undefined;
  };
  fields: {
    color: string;
    model: string;
    location: string;
    available: string;
  };
};

type LoaderData = {
  bike: Bike;
};

export const action: ActionFunction = async ({ request, params }) => {
  const bike = await DB.bike.findUnique({
    where: { id: params.bikeId },
  });

  if (!bike) {
    throw new Response('Bike with the given ID does not exist', { status: 404 });
  }

  const form = await request.formData();

  const color = form.get('color');
  const model = form.get('model');
  const location = form.get('location');
  const availability = form.get('available');

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
  const data = { model, location, available, color };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: data });
  }

  await DB.bike.update({ where: { id: bike.id }, data });

  return redirect(`/dashboard/bikes`);
};

export const loader: LoaderFunction = async ({ params }) => {
  const bike = await DB.bike.findUnique({
    where: { id: params.bikeId },
  });

  if (!bike) {
    throw new Response("Couldn't find a bike with the given id", { status: 404 });
  }

  return json<LoaderData>({ bike });
};

export default function NewBikeRoute() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const getData = (name: keyof ActionData['fields']) => {
    return loaderData.bike[name] ? loaderData.bike[name] : actionData?.fields?.[name];
  };

  const getError = (name: keyof ActionData['fields']) => {
    return actionData?.fieldErrors?.[name];
  };

  return (
    <div className="p-5 lg:p-20 justify-center">
      <h1 className="text-2xl font-bold text-center">Edit Bike</h1>
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
                  defaultValue={String(getData('model'))}
                  aria-invalid={Boolean(getError('model')) || undefined}
                  aria-errormessage={getError('model') ? 'model-error' : undefined}
                />
                {getError('model') ? (
                  <p className="font-light text-sm text-red-600" role="alert" id="model-error">
                    Model {getError('model')}
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
                  defaultValue={String(getData('location'))}
                  aria-invalid={Boolean(getError('location')) || undefined}
                  aria-errormessage={getError('location') ? 'location-error' : undefined}
                />
              </div>
              {getError('location') ? (
                <p className="font-light text-sm text-red-600" role="alert" id="location-error">
                  Location {getError('location')}
                </p>
              ) : null}
            </div>
            <label className="flex items-center cursor-pointer select-none mt-5">
              <span>Available For Reservation?</span>
              <input
                type="checkbox"
                name="available"
                defaultChecked={!!getData('available')}
                className="ml-2 checkbox checkbox-primary"
              />
            </label>
            <div className="card-actions justify-between items-center mt-2">
              <label className="flex items-center cursor-pointer select-none">
                Bike Color
                <input
                  type="color"
                  name="color"
                  className="ml-2 rounded-full w-6 h-6"
                  defaultValue={String(getData('color')) || '#ff0000'}
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
