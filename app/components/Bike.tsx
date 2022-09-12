import { useNavigate } from '@remix-run/react';
import { FaLocationArrow } from 'react-icons/fa';

import type { MouseEventHandler } from 'react';
import type { SerializeFrom } from '@remix-run/node';

type BikeCardProps = {
  bike: SerializeFrom<Models.BikeWithRelationships>;
};

export default function BikeCard({ bike }: BikeCardProps) {
  const navigate = useNavigate();

  const handleBikeClick = () => {
    navigate(bike.id);
  };

  const handleReserveClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    console.log('Reserve');
  };

  return (
    <div
      onClick={handleBikeClick}
      className="card bg-base-100 shadow-lg cursor-pointer hover:shadow-xl active:shadow-2xl transition-all"
    >
      <div className="card-body">
        <h2 className="card-title">{bike.model}</h2>
        <h3 className="flex flex-row items-center">
          <FaLocationArrow className="mr-2" />
          {bike.location}
        </h3>
        <p>{bike.reservations.length} reservations</p>
        <div className="card-actions justify-between items-center">
          <div className="tooltip tooltip-right" data-tip={bike.color}>
            <div
              className="text-neutral-content rounded-full w-6 h-6"
              style={{
                backgroundColor: bike.color,
              }}
            />
          </div>
          <button className="btn text-white" onClick={handleReserveClick}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
