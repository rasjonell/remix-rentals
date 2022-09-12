import type { Prisma } from '@prisma/client';

declare global {
  namespace Models {
    type BikeWithRelationships = Prisma.BikeGetPayload<{ include: { reservations: true } }>;
    type UserWithRelationships = Prisma.UserGetPayload<{ include: { reservations: true } }>;
  }
}
