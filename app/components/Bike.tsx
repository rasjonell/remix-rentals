import { FaLocationArrow } from 'react-icons/fa';

import type { SerializeFrom } from '@remix-run/node';

type BikeCardProps = {
  bike: SerializeFrom<Models.BikeWithRelationships>;
};

export default function BikeCard({ bike }: BikeCardProps) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">{bike.model}</h2>
        <h3 className="flex flex-row items-center">
          <FaLocationArrow className="mr-2" />
          {bike.location}
        </h3>
        <p>{bike.reservations.length} reservations</p>
        <div className="card-actions justify-between items-center">
          <div className="tooltip tooltip-right" data-tip={`Color: ${bike.color}`}>
            <div
              className="text-neutral-content rounded-full w-6 h-6"
              style={{
                backgroundColor: bike.color,
              }}
            />
          </div>
          <button className="btn text-white">Reserve</button>
        </div>
      </div>
    </div>
  );
}
