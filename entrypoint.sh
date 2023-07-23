#!/bin/sh

# Run Prisma database migrations and seed
npx prisma migrate deploy

# Run Next standalone server
node server.js
