import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const healthCheckRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/health',
    {
      schema: {
        summary: 'Health check',
        tags: ['health'],
      },
    },
    (_, reply) => {
      return reply.status(200).send({ status: 'ok' })
    }
  )
}
