import type { SerializeFrom } from '@remix-run/node';

type TableProps = { user: SerializeFrom<Models.UserWithRelationships> };

export default function BikeReservationsTable({ user }: TableProps) {
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
          </tr>
        </thead>
        <tbody>
          {user.reservations.map((reservation, index) => (
            <tr key={reservation.id} className="text-center">
              <th>{index + 1}</th>
              <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
              <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
              <td>{reservation.Bike.model}</td>
              <td>{user.username}</td>
              <td>{new Date(reservation.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
