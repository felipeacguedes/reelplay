import jwt from 'jsonwebtoken'
import type { FastifyRequest, FastifyReply } from 'fastify'
import db from './db'

const JWT_SECRET = process.env.JWT_SECRET ?? 'reelplay-secret'

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' })
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Token não fornecido.' })
  }

  const token = authHeader.split(' ')[1]!

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = await db.user.findUnique({ where: { id: payload.userId } })

    if (!user) {
      return reply.status(401).send({ error: 'Usuário não encontrado.' })
    }

    ;(request as FastifyRequest & { user: typeof user }).user = user
  } catch {
    return reply.status(401).send({ error: 'Token inválido.' })
  }
}