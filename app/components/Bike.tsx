import { Form } from '@remix-run/react';
import { FaLocationArrow, FaStar } from 'react-icons/fa';

import type { SerializeFrom } from '@remix-run/node';

import BikeModal from '~/components/BikeModal';

type BikeCardProps = {
  withActions?: boolean;
  bike: SerializeFrom<Models.BikeWithRelationships>;
  user: SerializeFrom<Models.UserWithRelationships> | null;
};

export default function BikeCard({ bike, user, withActions = false }: BikeCardProps) {
  const userReservation =
    user &&
    user.reservations.length > 0 &&
    bike.reservations.find((reservation) => reservation.userId === user.id);

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
      <div className="card-body">
        <h2 className="card-title">{bike.model}</h2>
        <h3 className="flex flex-row items-center">
          <FaLocationArrow className="mr-2" />
          {bike.location}
        </h3>
        <p className="pt-2">
          {bike.reservations.length} reservation{bike.reservations.length > 1 ? 's' : ''}
        </p>
        {userReservation ? (
          <p className="font-light text-sm text-secondary">
            Reserved from {new Date(userReservation.startDate).toLocaleDateString()} to{' '}
            {new Date(userReservation.endDate).toLocaleDateString()}
          </p>
        ) : null}
        {withActions ? (
          <div className="card-actions justify-between items-center">
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center pr-5">
                <FaStar size={24} />
                <span className="ml-2 text-lg">{bike.rating} / 5</span>
              </div>

              <div className="tooltip tooltip-right" data-tip={bike.color}>
                <div
                  className="text-neutral-content rounded-full w-6 h-6"
                  style={{
                    backgroundColor: bike.color,
                  }}
                />
              </div>
            </div>
            {userReservation ? (
              <Form method="post" action="/bikes">
                <input type="hidden" name="intent" value="cancel" />
                <input type="hidden" name="reservationId" value={userReservation.id} />

                <button type="submit" className="btn btn-warning">
                  Cancel
                </button>
              </Form>
            ) : (
              <a href={`#reserve-${bike.id}`} className="btn text-white">
                Reserve
              </a>
            )}
          </div>
        ) : null}
      </div>
      <BikeModal bike={bike} />
    </div>
  );
}
