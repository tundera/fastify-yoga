import fs from 'fs'

// Create dir for logs
const logDir = './logs'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

export const logger =
  process.env.NODE_ENV !== 'production'
    ? {
        prettyPrint: {
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      }
    : {
        level: 'warn',
        file: logDir + '/warn-logs.log',
      }
