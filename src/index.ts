import envSchema from 'env-schema'

import { buildApp } from 'src/app'

const app = buildApp()

const { PORT } = envSchema({
  dotenv: true,
  schema: {
    type: 'object',
    required: ['PORT'],
    properties: {
      PORT: {
        type: 'string',
        default: 4000,
      },
    },
  },
})

app
  .listen(PORT as string, '0.0.0.0')
  .then((serverUrl) => {
    app.log.info(`GraphQL API located at ${serverUrl}/graphql`)
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
