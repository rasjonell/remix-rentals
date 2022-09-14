/* eslint-disable jsx-a11y/anchor-is-valid */
import { Form } from '@remix-run/react';
import { useRef, useState } from 'react';

import type { ChangeEvent } from 'react';
import type { SerializeFrom } from '@remix-run/node';
import { getDateRangeError } from '~/utils/validate';

type BikeModalProps = {
  bike: SerializeFrom<Models.BikeWithRelationships>;
};

export default function BikeModal({ bike }: BikeModalProps) {
  const form = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dateState, setDateState] = useState({ startDate: '', endDate: '' });

  const handleFormSubmit = () => {
    if (!form.current) {
      return;
    }

    const dateError = getDateRangeError(dateState.startDate, dateState.endDate, bike.reservations);
    if (dateError) {
      return setError(dateError);
    }

    form.current.submit();
  };

  const handleDateChange = (name: keyof typeof dateState) => (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;

    setDateState({ ...dateState, [name]: value });
  };

  return (
    <div className="modal modal-bottom sm:modal-middle" id={`reserve-${bike.id}`}>
      <div className="modal-box relative">
        <a href="#" className="btn btn-sm btn-circle btn-outline absolute right-2 top-2">
          ✕
        </a>
        <Form action="/bikes" method="post" ref={form}>
          <input type="hidden" name="intent" value="reserve" />
          <input type="hidden" name="bikeId" value={bike.id} />

          <h3 className="font-bold text-lg">Reserve "{bike.model}"</h3>
          <p className="py-4">Please select the period of time to reserve this bike!</p>
          <div className="py-3">
            <label className="flex flex-row justify-between items-center w-full">
              <p className="font-light mr-2">Start Date: </p>
              <input
                required
                type="date"
                name="startDate"
                value={dateState.startDate}
                onChange={handleDateChange('startDate')}
                className="input input-primary input-sm w-3/4"
              />
            </label>
          </div>
          <div>
            <label className="flex flex-row justify-between items-center w-full">
              <p className="font-light mr-2">End Date: </p>
              <input
                required
                type="date"
                name="endDate"
                value={dateState.endDate}
                onChange={handleDateChange('endDate')}
                className="input input-primary input-sm w-3/4"
              />
            </label>
          </div>
          <p className="font-light text-red-400 mt-5 text-center">{error || null}</p>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleFormSubmit}>
              Reserve
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
