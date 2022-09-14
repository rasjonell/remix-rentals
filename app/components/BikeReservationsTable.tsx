import type { SerializeFrom } from '@remix-run/node';

type TableProps = { bike: SerializeFrom<Models.BikeWithRelationships> };

export default function BikeReservationsTable({ bike }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr className="text-center">
            <th></th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Bike</th>
            <th>Reserved By</th>
            <th>Reserved At</th>
          </tr>
        </thead>
        <tbody>
          {bike.reservations.map((reservation, index) => (
            <tr key={reservation.id} className="text-center">
              <th>{index + 1}</th>
              <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
              <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
              <td>{bike.model}</td>
              <td>{reservation.User.username}</td>
              <td>{new Date(reservation.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
