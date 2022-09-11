import { Link } from '@remix-run/react';
import ThemeToggler from './ThemeToggler';

export default function NavBar() {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
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
            <li>
              <Link to="/bikes">Bikes</Link>
            </li>
            <li>
              <Link to="/">Reservations</Link>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Bike Rentals
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link to="/bikes">Bikes</Link>
          </li>
          <li>
            <Link to="/">Reservations</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeToggler />
        <Link to="/" className="ml-3 btn">
          Login
        </Link>
      </div>
    </div>
  );
}
