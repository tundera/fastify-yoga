import { createServer } from '@graphql-yoga/node'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'

import { schema } from 'src/graphql/schema'
import { logger } from 'src/logger'

export function buildApp() {
  const app = fastify({ logger })

  const graphQLServer = createServer<{
    req: FastifyRequest
    reply: FastifyReply
  }>({
    schema,
    // Integrate Fastify Logger to Yoga
    logging: app.log,
  })

  // Health check route
  app.route({
    url: '/healthcheck',
    method: ['GET'],
    handler: async (req, reply) => {
      return 'OK'
    },
  })

  // GraphQL server route
  app.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      const response = await graphQLServer.handleIncomingMessage(req, {
        req,
        reply,
      })
      for (const [name, value] of response.headers) {
        reply.header(name, value)
      }

      reply.status(response.status)
      reply.send(response.body)
    },
  })

  return app
}
