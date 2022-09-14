# React Bike Rentals - TopTal Project

# Running It Locally

In order to run the project locally you need to:

- Clone the repo: `git clone https://git.toptal.com/screening/Gurgen-Hayrapetyan.git`
- Navigate to the project `cd Gurgen-Hayrapetyan`
- Copy and rename `.env.example`: `cp .env.example .env` and change it according to your setup
- Set up the database:
  - Create SQLite database: `npx prisma db push`
  - Seed it with a `Manager` user and a couple of `Bike`s: `npx prisma db seed`
- Build the project: `npm run build`
- Run a local server: `npm start`
