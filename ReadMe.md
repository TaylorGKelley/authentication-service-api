# Authentication Service

This authentication service manages all users associated with any of the court reporting applications.

## Inner Workings

This API has a few different routes to manage creating, logging in, updating, and refreshing tokens for users. It manages information such as user profiles, user roles, valid access/refresh tokens, and other user specific information that should be accessible globally. It is responsible for verifying if a user is logged in, so that other API's on the network are able to verify if a user has access to different routes.

### External Dependencies

- PostgreSQL (Database)
- Redis (Token storage)

## Steps to run the program

Create a `.env` file in the root directory, copying the contents of `.example.env` and adding your environments details to their respective variables. (i.e. Database URL and the port the app should run on).

For migrating the database, run `npm run db:generate`, then once the migrations have finished generating, run `npm run db:migrate`. Run `npm run db:seed` to populate your database with the seed data.

After these steps have been completed you are safe to run the api with `npm run dev`.
