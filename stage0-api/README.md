# stage0-api

To install dependencies:

```bash
bun install
```

Start PostgreSQL and the API with Docker Compose:

```bash
docker compose up --build
```

For local development, copy `.env.example` to `.env`, start PostgreSQL with
`docker compose up db`, apply the migration, and run the API:

```bash
bun run db:migrate
bun run index.ts
```

Run the integration tests while PostgreSQL is available:

```bash
bun test
```
