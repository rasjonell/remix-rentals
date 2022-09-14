import { Link } from '@remix-run/react';
import { FaSignOutAlt } from 'react-icons/fa';

import type { SerializeFrom } from '@remix-run/node';
import type { getUser } from '~/services/session.server';

import ThemeToggler from '~/components/ThemeToggler';

type NavBarProps = {
  user: SerializeFrom<Awaited<ReturnType<typeof getUser>>>;
};

export default function NavBar({ user }: NavBarProps) {
  const isManager = user?.isManager;

  const managerItems = (
    <>
      <li>
        <Link to="/dashboard/bikes">Dashboard</Link>
      </li>
      <li>
        <Link to="/dashboard/bikes">Bikes</Link>
      </li>
      <li>
        <Link to="/dashboard/users">Users</Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        {isManager ? (
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                fill="none"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {managerItems}
            </ul>
          </div>
        ) : null}
        <Link to="/bikes" className="btn btn-ghost normal-case text-xl">
          Bike Rentals
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">{isManager ? managerItems : null}</ul>
      </div>
      <div className="navbar-end">
        <div className="px-5 flex items-center">
          <ThemeToggler />
        </div>
        {user ? (
          <Link to="/logout" className="btn btn-square btn-outline">
            <FaSignOutAlt size={18} />
          </Link>
        ) : (
          <Link to="/login" className="btn btn-outline">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
