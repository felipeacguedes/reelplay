import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { getRandomMovie, type MovieFilters } from './tmdb'
import { registerRoutes } from './routes'

const app = Fastify({ logger: true })

async function main() {
  await app.register(cors, {
    origin: 'http://localhost:5173',
  })

  // Rota pública — sortear filme
  app.get('/random', async (request, reply) => {
    const query = request.query as MovieFilters
    try {
      const movie = await getRandomMovie(query)
      return reply.send(movie)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido.'
      return reply.status(404).send({ error: message })
    }
  })

  // Rota pública — health check
  app.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok' })
  })

  // Rotas autenticadas — histórico e watchlist
  await registerRoutes(app)

  try {
    await app.listen({ port: 3333, host: '0.0.0.0' })
    console.log('🎬 Reelplay backend rodando em http://localhost:3333')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
