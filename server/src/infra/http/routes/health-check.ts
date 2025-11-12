import { log } from '@/infra/lib/logger'
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
      log.info('Health check endpoint was called')

      return reply.status(200).send({ status: 'A API está rodando!' })
    }
  )
}
