import { createClerkClient } from '@clerk/backend'
import type { FastifyRequest, FastifyReply } from 'fastify'
import db from './db'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
})

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Token não fornecido.' })
  }

  const token = authHeader.split(' ')[1]!

  try {
    const requestState = await clerk.authenticateRequest(
      new Request(`http://localhost:3333${request.url}`, {
        method: request.method,
        headers: request.headers as HeadersInit,
      }),
      { headerToken: token }
    )

    if (!requestState.isSignedIn) {
      return reply.status(401).send({ error: 'Não autenticado.' })
    }

    const clerkId = requestState.toAuth().userId!

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

    ;(request as FastifyRequest & { user: typeof user }).user = user
  } catch (err) {
    console.error('Erro ao verificar token:', err)
    return reply.status(401).send({ error: 'Token inválido.' })
  }
}