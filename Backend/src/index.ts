import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { getRandomMovie, type MovieFilters } from "./tmdb.js";

const app = Fastify();

await app.register(cors, {
    origin: "http://localhost:5173",
});

app.get("", async (request, reply) => {
    const query = request.query as MovieFilters;

    try {
        const movie = await getRandomMovie(query);
        return reply.send(movie);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Erro desconhecido.";
        return reply.status(400).send({ error:message });
    }
});

app.get("/health", async (_request, reply) => {
    return reply.send({ status: "ok" });
});

try {
    await app.listen({ port: 3333, host: "0.0.0.0" });
    console.log("ReelPlay backend rodando em http://localhost:3333");
} catch (err) {
    app.log.error(err);
    process.exit(1);
}