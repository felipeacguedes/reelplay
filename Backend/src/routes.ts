import type { FastifyInstance, FastifyRequest } from 'fastify'
import { requireAuth } from './auth'
import db from './db'

interface UserRequest extends FastifyRequest {
  user: {
    id: string
    email: string
    name: string | null
  }
}

interface MovieBody {
  tmdbId: number
  title: string
  posterPath?: string
  voteAverage?: number
}

export async function registerRoutes(app: FastifyInstance) {
  // ── Histórico ────────────────────────────────────────────

  // Salva um filme no histórico
  app.post('/history', { preHandler: requireAuth }, async (request, reply) => {
    const { user } = request as UserRequest
    const { tmdbId, title, posterPath } = request.body as MovieBody

    const entry = await db.historyEntry.create({
      data: { userId: user.id, tmdbId, title, posterPath },
    })

    return reply.status(201).send(entry)
  })

  // Busca o histórico do usuário
  app.get('/history', { preHandler: requireAuth }, async (request, reply) => {
    const { user } = request as UserRequest

    const history = await db.historyEntry.findMany({
      where: { userId: user.id },
      orderBy: { rolledAt: 'desc' },
      take: 50,
    })

    return reply.send(history)
  })

  // ── Watchlist ─────────────────────────────────────────────

  // Adiciona à watchlist
  app.post('/watchlist', { preHandler: requireAuth }, async (request, reply) => {
    const { user } = request as UserRequest
    const { tmdbId, title, posterPath, voteAverage } = request.body as MovieBody

    try {
      const entry = await db.watchlistEntry.create({
        data: { userId: user.id, tmdbId, title, posterPath, voteAverage },
      })
      return reply.status(201).send(entry)
    } catch {
      return reply.status(409).send({ error: 'Filme já está na watchlist.' })
    }
  })

  // Busca a watchlist do usuário
  app.get('/watchlist', { preHandler: requireAuth }, async (request, reply) => {
    const { user } = request as UserRequest

    const watchlist = await db.watchlistEntry.findMany({
      where: { userId: user.id },
      orderBy: { addedAt: 'desc' },
    })

    return reply.send(watchlist)
  })

  // Remove da watchlist
  app.delete('/watchlist/:tmdbId', { preHandler: requireAuth }, async (request, reply) => {
    const { user } = request as UserRequest
    const { tmdbId } = request.params as { tmdbId: string }

    await db.watchlistEntry.deleteMany({
      where: { userId: user.id, tmdbId: Number(tmdbId) },
    })

    return reply.status(204).send()
  })
}
