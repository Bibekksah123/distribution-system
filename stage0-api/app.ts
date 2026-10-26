import express from "express";
import pinoHttp from "pino-http";
import { prisma } from "./lib/prisma";

const app = express();

app.use(express.json());
app.use(pinoHttp());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body as {
    title?: unknown;
    content?: unknown;
  };

  if (typeof title !== "string" || typeof content !== "string") {
    res.status(400).json({ error: "title and content must be strings" });
    return;
  }

  const note = await prisma.note.create({
    data: { title, content },
  });

  res.status(201).json(note);
});

app.get("/api/notes/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "id must be a positive integer" });
    return;
  }

  const note = await prisma.note.findUnique({ where: { id } });

  if (!note) {
    res.status(404).json({ error: "note not found" });
    return;
  }

  res.json(note);
});

export default app;
