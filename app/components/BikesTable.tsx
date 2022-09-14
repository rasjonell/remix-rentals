import type { SerializeFrom } from '@remix-run/node';
import { Link } from '@remix-run/react';

type TableProps = { bikes: SerializeFrom<Array<Models.BikeWithRelationships>> };

export default function BikesTable({ bikes }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr className="text-center">
            <th></th>
            <th>Model</th>
            <th>Color</th>
            <th>Average Rating</th>
            <th>Ratings</th>
            <th>Availability</th>
            <th>Reservations</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bikes.map((bike, index) => (
            <tr key={bike.id} className="text-center">
              <th>{index + 1}</th>
              <td>{bike.model}</td>
              <td>{bike.color}</td>
              <td>{bike.rating.toFixed(2)}</td>
              <td>{bike.ratingCount}</td>
              <td>{bike.available ? 'Available' : 'Not Available'}</td>
              <td>
                <Link to={`${bike.id}/reservations`} className="btn btn-sm">
                  {bike.reservations.length}
                </Link>
              </td>
              <td>{new Date(bike.createdAt).toLocaleDateString()}</td>
              <td className="flex justify-center">
                <Link to={`${bike.id}/edit`} className="btn btn-sm btn-warning mr-2">
                  Edit
                </Link>
                <form method="post">
                  <input type="hidden" name="bikeId" value={bike.id} />
                  <button type="submit" className="btn btn-sm btn-error">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
