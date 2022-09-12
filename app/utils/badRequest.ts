import { json } from '@remix-run/node';

export function badRequest<T extends object>(data: T) {
  return json(data, { status: 400 });
}
