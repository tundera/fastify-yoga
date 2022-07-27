import fs from 'fs'
import datadog from 'pino-datadog'

/**
 * Creates a synchronous pino-datadog stream
 *
 * @param {object} options - Datadog options including your account's API Key
 *
 * @typedef {DestinationStream}
 */
export const stream = datadog.createWriteStreamSync({
  apiKey: process.env.DATADOG_API_KEY as string,
  ddsource: 'my-source-name',
  ddtags: 'tag,not,it',
  service: 'my-service-name',
  size: 1,
})

// Create dir for logs
const logDir = './logs'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

export const logger =
  process.env.NODE_ENV !== 'production'
    ? {
        level: 'info',
        stream,
      }
    : {
        level: 'warn',
        file: logDir + '/warn-logs.log',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        },
      }
