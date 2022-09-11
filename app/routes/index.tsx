import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div>
      <h1>Welcome To Bike Rentals</h1>
      <Link to="/bikes" className="link">
        Check out bikes
      </Link>
    </div>
  );
}
