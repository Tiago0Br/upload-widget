import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({ message: error.message, issues: error.validation })
  }

  console.error(error)
  return reply.status(500).send({ message: 'Internal server error' })
}
