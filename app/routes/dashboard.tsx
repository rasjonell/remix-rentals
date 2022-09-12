import { Outlet } from '@remix-run/react';

import NavBar from '~/components/NavBar';

export default function DashboardIndex() {
  return (
    <>
      <NavBar isManager />
      <Outlet />
    </>
  );
}
