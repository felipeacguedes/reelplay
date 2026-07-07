import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import path from 'node:path'
import { getRandomMovie, type MovieFilters } from './tmdb'
import { registerRoutes } from './routes'
import { generateToken } from './auth'
import db from './db'

const app = Fastify({ logger: true })

async function main() {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://reelplay.up.railway.app',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ]

  await app.register(cors, {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Login / cadastro por username
  app.post('/api/auth/login', async (request, reply) => {
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
  app.get('/api/random', async (request, reply) => {
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
  app.get('/api/health', async (_request, reply) => {
    return reply.send({ status: 'ok' })
  })

  // Rotas autenticadas
  await registerRoutes(app)

  // Servir frontend buildado
  const publicDir = path.join(process.cwd(), 'public')
  await app.register(fastifyStatic, {
    root: publicDir,
    prefix: '/',
    wildcard: true,
  })

  // SPA fallback — rotas do React Router servem index.html
  app.setNotFoundHandler(async (_request, reply) => {
    return reply.status(200).sendFile('index.html')
  })

  const port = Number(process.env.PORT) || 3333
  try {
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`🎬 Reelplay backend rodando em http://localhost:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()