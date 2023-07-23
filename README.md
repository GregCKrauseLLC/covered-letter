# Next Starter App

This app is intended to be an opinionated starting point for Next.js apps.

## Running Next.js server

Start Postgres Docker containers

```sh
docker run --name postgres-test -e POSTGRES_PASSWORD=Ne3Ds2BSecUreD -d -p 127.0.0.1:5432:5432/tcp -d postgres
docker run --name postgres-shadow-test -e POSTGRES_PASSWORD=Ne3Ds2BSecUreD -d -p 127.0.0.1:5433:5432/tcp -d postgres
```

Prepare environment variables, database, and run development server

```sh
cp .env.example .env # values will need to be populated
npx prisma migrate dev # update database schema
npx prisma db seed # seed the database with blog posts
npm run dev
```

Prisma has a built in studio that can be used to interact with the PostgreSQL database. It can be accessed as follows:

```sh
npx prisma studio
```

## Building a deployment

The `next build` step currently requires an API server to be running on localhost:3000 for static generation.

```sh
# Run API server on localhost for the Dockerfile `next build` step
cd next-app
npm install
export API_URL=http://localhost:3000
npm run dev
```

Then, in a separate shell, run the following:

```sh
npm run build
```

Visit [http://localhost:3000](http://localhost:3000)

# Helpful resources for Next

- [Fireship Next.js Course](https://fireship.io/courses/nextjs/)
- [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js/)
