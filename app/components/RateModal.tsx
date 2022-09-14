/* eslint-disable jsx-a11y/anchor-is-valid */
import type { SerializeFrom } from '@remix-run/node';

type RateModalProps = {
  bike: SerializeFrom<Models.BikeWithRelationships>;
};

export default function RateModal({ bike }: RateModalProps) {
  return (
    <div className="modal modal-bottom sm:modal-middle" id={`rate-${bike.id}`}>
      <div className="modal-box relative">
        <a href="#" className="btn btn-sm btn-circle btn-outline absolute right-2 top-2">
          ✕
        </a>
        <form action="/bikes" method="post">
          <input type="hidden" name="intent" value="rate" />
          <input type="hidden" name="bikeId" value={bike.id} />

          <h3 className="font-bold text-lg">Rate "{bike.model}"</h3>
          <p className="py-4">Please Choose Your Rating For This Bike</p>
          <div className="rating rating-lg py-5 flex justify-center">
            <input
              value="1"
              type="radio"
              name="rating"
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              value="2"
              type="radio"
              name="rating"
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              value="3"
              type="radio"
              name="rating"
              defaultChecked
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              value="4"
              type="radio"
              name="rating"
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              value="5"
              type="radio"
              name="rating"
              className="mask mask-star-2 bg-orange-400"
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn">
              Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
