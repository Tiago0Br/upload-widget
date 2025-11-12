import pino from 'pino'

export const log = pino({
  level: 'debug',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'error',
        options: {
          name: 'terminal',
          colorize: true,
          levelFirst: true,
          include: 'level,time',
          translateTime: 'yyyy-mm-dd HH:mm:ss Z',
        },
      },
    ],
  },
})
