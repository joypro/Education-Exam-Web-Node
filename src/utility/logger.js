const winston 		= require('winston');
const config 		= require('../config');
 
const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} - ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(),myFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: config.BASEPATH+'/src/logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: config.BASEPATH+'/src/logs/combined.log' }),
  ],
});


//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}


module.exports = {
	logger:logger
};
