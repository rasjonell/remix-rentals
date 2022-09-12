import type { MetaFunction } from '@remix-run/node';
import { Meta, Links, Outlet, Scripts, LiveReload, ScrollRestoration } from '@remix-run/react';

import styles from '~/styles/app.css';
import { useTheme } from './contexts/theme';
export const links = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Bike Rentals',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  const themeContext = useTheme();

  return (
    <html lang="en" data-theme={themeContext.theme}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
