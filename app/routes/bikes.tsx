import { Outlet } from '@remix-run/react';

import NavBar from '~/components/NavBar';

export default function Index() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
