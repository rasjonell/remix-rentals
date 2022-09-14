import { PrismaClient } from '@prisma/client';
import { hashPassword } from '~/services/session.server';

const DB = new PrismaClient();

async function seed() {
  await Promise.all([
    ...getBikes().map((data) => DB.bike.create({ data: { ...data, available: true } })),
  ]);
  await DB.user.create({
    data: { isManager: true, username: 'admin', passwordHash: await hashPassword('adminadmin') },
  });
}

seed();

function getBikes() {
  return [
    {
      rating: 5.0,
      ratingCount: 1,
      color: '#0803BB',
      model: 'Propel Advanced',
      location: 'Yerevan, Armenia',
    },
    {
      rating: 3.0,
      ratingCount: 3,
      color: '#404040',
      model: 'Roam Disc',
      location: 'Vagharshapat, Armenia',
    },
    {
      rating: 4.5,
      ratingCount: 1,
      color: '#28145e',
      model: 'ATX',
      location: 'Vagharshapat, Armenia',
    },
    {
      rating: 5,
      ratingCount: 5,
      color: '#73fd32',
      model: 'Trinity Advanced',
      location: 'Yerevan, Armenia',
    },
  ];
}
