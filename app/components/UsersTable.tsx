import type { SerializeFrom } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';

type TableProps = { users: SerializeFrom<Array<Models.UserWithRelationships>> };

export default function UsersTable({ users }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th>Account Status</th>
            <th>Reservations</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <th>{index + 1}</th>
              <td>{user.username}</td>
              <td>{user.isManager ? 'Manager' : 'Basic User'}</td>
              <td>{user.reservations.length}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="flex">
                <Link to={`${user.id}/edit`} className="btn btn-sm btn-warning mr-2">
                  Edit
                </Link>
                <Form method="post">
                  <input type="hidden" name="userId" value={user.id} />
                  <button type="submit" className="btn btn-sm btn-error">
                    Delete
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
