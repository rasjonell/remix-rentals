import type { LoaderFunction } from '@remix-run/node';

import { logout } from '~/services/session.server';

export const loader: LoaderFunction = ({ request }) => logout(request);
