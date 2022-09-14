/* eslint-disable jsx-a11y/anchor-is-valid */
import { FaLocationArrow, FaStar } from 'react-icons/fa';

import type { SerializeFrom } from '@remix-run/node';

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
    <div
      // onClick={handleBikeClick}
      className="card bg-base-100 shadow-lg cursor-pointer hover:shadow-xl active:shadow-2xl transition-all"
    >
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
              <button className="btn text-white">Cancel</button>
            ) : (
              <a href={`#reserve-${bike.id}`} className="btn text-white">
                Reserve
              </a>
            )}
          </div>
        ) : null}
      </div>

      <div className="modal modal-bottom sm:modal-middle" id={`reserve-${bike.id}`}>
        <div className="modal-box relative">
          <a href="#" className="btn btn-primary btn-sm btn-circle absolute right-2 top-2">
            ✕
          </a>
          <form action="/bikes" method="post">
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
                  className="input input-primary input-sm w-3/4"
                />
              </label>
            </div>
            <div className="modal-action">
              <button
                type="submit"
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Reserve
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
