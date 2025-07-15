import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { errorHandler } from './middlewares/error-handler'
import { exportUploadRoute } from './routes/export-uploads'
import { getUploadsRoute } from './routes/get-uploads'
import { healthCheckRoute } from './routes/health-check'
import { uploadImageRoute } from './routes/upload-image'
import { transformSwaggerSchema } from './transform-swagger-schema'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler(errorHandler)

server.register(fastifyCors, { origin: '*' })
server.register(fastifyMultipart)
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Server',
      description: 'API for uploading images',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
})

server.register(uploadImageRoute)
server.register(getUploadsRoute)
server.register(exportUploadRoute)
server.register(healthCheckRoute)

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })
