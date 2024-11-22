FROM oven/bun:latest
WORKDIR  /bloggify

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install
RUN bun install bun 
RUN bun run build
RUN bun run start