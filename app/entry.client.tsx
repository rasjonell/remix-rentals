import { hydrateRoot } from 'react-dom/client';
import { RemixBrowser } from '@remix-run/react';
import ThemeContextProvider from '~/contexts/theme';

hydrateRoot(
  document,
  <ThemeContextProvider>
    <RemixBrowser />
  </ThemeContextProvider>,
);
