import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { createServer, type Server } from "node:http";

let server: Server;
let baseUrl: string;
let app: typeof import("../app").default;
let prisma: typeof import("../lib/prisma").prisma;

beforeAll(async () => {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://app:app@localhost:5432/appdb";
  }

  ({ default: app } = await import("../app"));
  ({ prisma } = await import("../lib/prisma"));

  await prisma.note.deleteMany();
  server = createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("Test server did not expose a TCP address");
      }
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await prisma.note.deleteMany();
  await prisma.$disconnect();
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe("notes API", () => {
  it("reports health", async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("creates and reads a note", async () => {
    const createResponse = await fetch(`${baseUrl}/api/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Test note", content: "Test content" }),
    });
    const created = (await createResponse.json()) as { id: number };

    expect(createResponse.status).toBe(201);
    expect(created.id).toBeGreaterThan(0);

    const getResponse = await fetch(`${baseUrl}/api/notes/${created.id}`);

    expect(getResponse.status).toBe(200);
    expect(await getResponse.json()).toMatchObject({
      id: created.id,
      title: "Test note",
      content: "Test content",
    });
  });
});
