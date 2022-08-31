# NestJS GraphQL Monolith Express

## Description

Full [NodeJS](https://nodejs.org/en/) boilerplate of a [NestJS](https://nestjs.com/) [GraphQL](https://graphql.org/)
monolithic
backend API using [PostgreSQL](https://www.postgresql.org/) as the database.

### Technologies

In terms of languages this template takes
a [NestJS GraphQL Code First Approach](https://docs.nestjs.com/graphql/quick-start#code-first), so it's fully written in
[TypeScript](https://www.typescriptlang.org/).

In terms of frameworks it uses:

* [NestJS](https://nestjs.com/) as the main NodeJS framework;
* [Express](http://expressjs.com/) as the HTTP and WS adapter;
* [Apollo](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express) as the
  GraphQL adapter for Express;
* [MikroORM](https://mikro-orm.io/) as the ORM for interacting with the database;
* [Sharp](https://sharp.pixelplumbing.com/) for image manipulation and optimization.

### Features

**Configuration** (adds most used config classes)**:**

* Cache with [Redis](https://redis.io/);
    - <small>NOTE: There's a caveat as you need to specify cache control directive for it to work</small>
* GraphQL with subscriptions and [GraphQL through Websockets](https://www.npmjs.com/package/graphql-ws);
* MikroORM with [SQLite](https://www.sqlite.org/index.html) in development and [PostgreSQL](https://www.postgresql.org/)
  in production.

**Authentication:**

* [JWT](https://jwt.io/) Authentication (local [OAuth](https://oauth.net/2/)) for HTTP;
* Custom Session Authentication for Websockets (based on Facebook Messenger Design);
* Two-Factor authentication with email.

**Uploader:**

* Basic image only uploader with [Sharp](https://sharp.pixelplumbing.com/) optimizations for a generic S3 Bucket.

**Pagination:**

* Has the generics for Edges and Paginated types;
* [Relay cursor pagination](https://relay.dev/graphql/connections.htm) function.

## GraphQL Upload Configuration

This template uses the latest version of [GraphQL Upload](https://github.com/jaydenseric/graphql-upload). Unfortunately
is uses [ECMAScript modules](https://nodejs.org/api/esm.html#modules-ecmascript-modules), and they're quite tricky to
use with most TypeScript frameworks. So, in order to make it
work I had to use these workarounds:

- For the library itself I use [dynamic imports](https://v8.dev/features/dynamic-import) to load both the middleware and
  the Scalar.
- In Jest I had to use the `--experimental-vm-modules` flag to make it work, so all your projects with this template
  will need to use [Yarn](https://yarnpkg.com/) package manager. Now the test command looks something like this:

```bash
$ yarn node --experimental-vm-modules $(yarn bin jest) 
```

- The UploadOptions interface now is local on the following file: `src/config/interfaces/upload-options.interface.ts`;
- Since the GraphQLUpload scalar is now a dynamic import you'll need to use the uploadScalar util that is located on the
  `src/uploader/utils/upload-scalar.util.ts` file on your Field decorators.

## Module Folder Structure

In terms of folders each [module](https://docs.nestjs.com/modules) is divided as follows:

<sup>**NOTE:** this is only a recommendation you can always use your own approach as long as they work with
NestJS.</sup>

```
C:/home/user/Home/IdeProjects/{project-folder}/src/{module-name}:.
├─── entities
│    │ {something}.entity.ts
│    ├─── gql:
│    │     {something}.type.ts
├─── interfaces
│     {something}.interface.ts
├─── enums
│     {something}.enum.ts
├─── dtos
│     {something}.dto.ts
├─── inputs
│     {something}.input.ts
├─── tests
│     {something}.spec.ts
│ {module-name}.module.ts
│ {module-name}.service.ts
│ {module-name}.resolver.ts
```

### Entities (entities):

* Where you save all your entities;
* The entities are the classes that represent the [database tables](https://mikro-orm.io/docs/defining-entities)
  and the [Graphql Object Types](https://docs.nestjs.com/graphql/resolvers#object-types);
* These are normally decorated with the [@Entity](https://mikro-orm.io/docs/defining-entities) decorator and the
  [@ObjectType](https://docs.nestjs.com/graphql/resolvers#object-types) decorator;
* <ins>File Extension:</ins> {something}.entity.ts
* **Gql (gql):**
    - Where you save the [Generic Graphql Object Types](https://docs.nestjs.com/graphql/resolvers#generics) (ex:
      PaginatedUsers, etc.);
    - These are normally decorated with the
      [@ObjectType](https://docs.nestjs.com/graphql/resolvers#object-types) decorator;
    - <ins>File Extension:</ins> {something}.type.ts

### Interfaces (interfaces):

* Where you save all the interfaces and TypeScript types;
* <ins>File Extension:</ins> {something}.interface.ts

### Enums (enums):

* Where you save all general enums and [Enum Type](https://docs.nestjs.com/graphql/unions-and-enums#code-first-1);
* <ins>File Extension:</ins> {something}.enum.ts

### Dtos (dtos):

* Where you save all the DTOs (Data Transfer Objects) mainly for your Queries;
* These are normally decorated with
  the [ArgsType](https://docs.nestjs.com/graphql/resolvers#dedicated-arguments-class) decorator;
* <ins>File Extension:</ins> {something}.dto.ts

### Inputs (inputs):

* Where you save all the [GraphQL Input Objects](https://docs.nestjs.com/graphql/mutations#code-first) mainly for
  your Mutations;
* These are normally decorated with
  the [@InputType](https://docs.nestjs.com/graphql/mutations#code-first) decorator;
* <ins>File Extension:</ins> {something}.input.ts

### Tests (tests):

* Where you save all the unit tests for your module's [services](https://docs.nestjs.com/providers#services),
  [resolvers](https://docs.nestjs.com/graphql/resolvers) and [controllers](https://docs.nestjs.com/controllers);
* These are normally the spec files generated by the cli, but you still need to move them to this folder;
* <ins>File Extension:</ins> {something}.spec.ts

### Optional Folders:

* **Embeddables (embeddables):**
    - Where you save all your [JSON Fields](https://www.geeksforgeeks.org/postgresql-json-data-type/) for your
      database tables;
    - These are normally decorated with the [@Embeddable](https://mikro-orm.io/docs/embeddables) decorator;
    - <ins>File Extension:</ins> {something}.embeddable.ts
* **Guards (guards):**
    - Where you save all your [NestJS Guards](https://docs.nestjs.com/guards) related to your module;
    - <ins>File Extension:</ins> {something}.guard.ts

## Initial Set Up

### Installation

```bash
$ yarn install
```

### Database Migrations

```bash
# creation
$ yarn migrate:create
# update
$ yarn migrate:update
```

### Running the app

```bash
# production mode
$ yarn start

# watch mode
$ yarn start:dev

# debug mode
$ yarn start:debug
```

## Local setup

1. Create a repo using this template;
2. Install the dependencies:

```bash
$ yarn install
```

3. Create a .env file with all the fields equal to the [example](.env.example).
4. Run the app in development mode:

```bash
$ yarn start:dev
```

## Unit Testing

### BEFORE EACH TEST (Individual or All):

* Check if NODE_ENV is not production;
* Remove the current test.db (if exits);
* Create a new test.db.

```bash
# remove test.db
$ rm test.db
# create a new test.db
$ yarn migrate:create
```

### All tests:

```bash
# unit tests
$ yarn run test  --detectOpenHandles
```

### Individual test:

```bash
# unit tests
$ yarn run test service-name.service.spec.ts --detectOpenHandles
```

## Deployment

### Steps:

1. Go to [DigitalOcean](https://www.digitalocean.com/), [Linode](https://www.linode.com/)
   or [Hetzner](https://www.hetzner.com/);
2. Create a server running [Ubuntu LTS](https://ubuntu.com/);
3. Install [dokku](https://dokku.com/docs~v0.28.1/getting-started/installation/#1-install-dokku);
4. Run the following commands on your server for dokku initial set-up:

```bash
$ cat ~/.ssh/authorized_keys | dokku ssh-keys:add admin
$ dokku domains:set-global your-global-domain.com
```

5. Create a new app and connect git:

```bash
$ dokku apps:create app-name
```

6. Add the [Postgres plugin](https://github.com/dokku/dokku-postgres) to dokku, create a new PG instance and link it to
   the app:

```bash
$ sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
$ dokku postgres:create app-name-db
$ dokku postgres:link app-name-db app-name
```

7. Add the [Redis plugin](https://github.com/dokku/dokku-redis) to dokku, and create a new Redis instance and link it to
   the app:

```bash
$ sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis
$ dokku redis:create app-name-redis
$ dokku redis:link app-name-redis app-name
```

8. Add all the other configurations as in the [example](.env.example) file:

```bash
$ dokku config:set app-name URL=https://your-domain.com ...
```

9. On the project folder on your local computer run the following commands:

```bash
$ git remote add dokku dokku@server-public-ip-address:app-name
$ git push dokku main:master
```

10. Finally set up SSL and a domain for your app:

```bash
$ sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
$ dokku config:set --global DOKKU_LETSENCRYPT_EMAIL=your-email@your.domain.com
$ dokku domains:set app-name your-domain.com
$ dokku letsencrypt:enable app-name
$ dokku letsencrypt:cron-job --add 
```

## Support the frameworks used in this template

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If
you'd like to join them, please [read more here](https://docs.nestjs.com/support).

Mikro-ORM is a TypeScript ORM for Node.js based on Data Mapper, Unit of Work and Identity Map patterns. If you like
MikroORM, give it a [star](https://github.com/mikro-orm/mikro-orm) on GitHub and
consider [sponsoring](https://github.com/sponsors/B4nan) its development!

[Sharp](https://sharp.pixelplumbing.com/) is a high performance Node.js image processor. If you want
to [support them.](https://opencollective.com/libvips)

## License

This template is [MIT licensed](LICENSE).
