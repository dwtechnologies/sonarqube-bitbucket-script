const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine( 
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs.log' }),
  ]
})

module.exports = logger
