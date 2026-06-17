import { createClerkClient } from '@clerk/backend'
import type { FastifyRequest, FastifyReply } from 'fastify'
import db from './db'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Token não fornecido.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = await clerk.verifyToken(token!)

    const clerkId = payload.sub

    // Busca ou cria o usuário no banco
    let user = await db.user.findUnique({ where: { clerkId } })

    if (!user) {
      const clerkUser = await clerk.users.getUser(clerkId)
      user = await db.user.create({
        data: {
          clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
          name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
        },
      })
    }

    // Injeta o usuário na request para as rotas usarem
    ;(request as FastifyRequest & { user: typeof user }).user = user
  } catch {
    return reply.status(401).send({ error: 'Token inválido.' })
  }
}
