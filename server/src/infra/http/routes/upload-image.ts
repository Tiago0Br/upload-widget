import { uploadImage } from '@/app/functions/upload-image'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/upload-image',
    {
      schema: {
        summary: 'Upload image',
        tags: ['upload'],
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({
            url: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 2 * 1024 * 1024, // 2MB,
        },
      })

      if (!uploadedFile) {
        return reply.status(400).send({ message: 'File is required' })
      }

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      if (uploadedFile.file.truncated) {
        return reply.status(400).send({ message: 'File size limit exceeded' })
      }

      if (isRight(result)) {
        const { url } = unwrapEither(result)

        return reply.status(201).send({ url })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: error.message })
        default:
          return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
