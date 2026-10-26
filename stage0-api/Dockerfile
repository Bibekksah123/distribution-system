FROM oven/bun:1.3.14-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

USER bun

CMD ["sh", "-c", "bun run db:migrate && bun run index.ts"]