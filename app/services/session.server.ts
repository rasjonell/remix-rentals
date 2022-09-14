import bcyrpt from 'bcrypt';
import { DB } from './db.server';

import { createCookieSessionStorage, redirect } from '@remix-run/node';

type LoginForm = {
  username: string;
  password: string;
  isManager?: boolean;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const storage = createCookieSessionStorage({
  cookie: {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    name: 'RJ_session',
    secrets: [sessionSecret],
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function login({ username, password }: LoginForm) {
  const user = await DB.user.findUnique({ where: { username } });

  if (!user) return null;

  const isCorrectPassword = await bcyrpt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return user;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);

  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

export async function register({ username, password, isManager = false }: LoginForm) {
  const passwordHash = await bcyrpt.hash(password, 10);
  const user = await DB.user.create({
    data: { username, passwordHash, isManager },
  });

  return user;
}

export async function hashPassword(password: string) {
  return bcyrpt.hash(password, 10);
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') {
    return null;
  }

  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);

  if (typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await DB.user.findUnique({
      where: { id: userId },
      include: { reservations: { include: { Bike: true } } },
    });

    return user;
  } catch {
    throw logout(request);
  }
}

export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);

    throw redirect(`/login?${searchParams}`);
  }

  return userId;
}

export async function requireManager(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const user = await getUser(request);

  if (!user?.isManager) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);

    throw redirect(`/login?${searchParams}`);
  }

  return user;
}
