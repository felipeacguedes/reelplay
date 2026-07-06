import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { getRandomMovie, type MovieFilters } from './tmdb'
import { registerRoutes } from './routes'
import { generateToken } from './auth'
import db from './db'

const app = Fastify({ logger: true })

async function main() {
  await app.register(cors, {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })

  // Login / cadastro por username
  app.post('/auth/login', async (request, reply) => {
    const { username } = request.body as { username: string }

    if (!username || username.trim().length < 2) {
      return reply.status(400).send({ error: 'Username deve ter ao menos 2 caracteres.' })
    }

    const clean = username.trim().toLowerCase()

    let user = await db.user.findUnique({ where: { email: clean } })

    if (!user) {
      user = await db.user.create({
        data: {
          email: clean,
          name: username.trim(),
        },
      })
    }

    const token = generateToken(user.id)
    return reply.send({ token, user: { id: user.id, name: user.name } })
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

  // Rotas autenticadas
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