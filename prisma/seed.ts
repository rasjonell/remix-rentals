import { PrismaClient } from '@prisma/client';

const DB = new PrismaClient();

async function seed() {
  await Promise.all(getBikes().map((data) => DB.bike.create({ data })));
}

seed();

function getBikes() {
  return [
    {
      color: 'Red',
      model: 'Rambo',
      location: 'Yerevan, Armenia',
    },
    {
      color: 'Green',
      model: 'Rambo New',
      location: 'Vagharshapat, Armenia',
    },
    {
      color: 'Orange',
      model: 'Rambo Orange',
      location: 'Vagharshapat, Armenia',
    },
    {
      color: 'Black',
      model: 'Not a Rambo',
      location: 'Yerevan, Armenia',
    },
  ];
}
