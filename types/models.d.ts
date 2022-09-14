import type { Prisma } from '@prisma/client';

declare global {
  namespace Models {
    type BikeWithRelationships = Prisma.BikeGetPayload<{
      include: { reservations: { include: { User: true } } };
    }>;

    type UserWithRelationships = Prisma.UserGetPayload<{
      include: { reservations: { include: { Bike: true } } };
    }>;
  }
}
