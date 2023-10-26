var winston = require('winston')
const fs = require('fs');
const path = require('path');
require('winston-daily-rotate-file');

//credentials used in the app
var credentials = require('../credentials.js');
global.LogFilesPath= path.resolve("./log")+'\\';
const logDir = global.LogFilesPath;

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: 'YYYY-MM-DD'
  });
//const filename = path.join(logDir, 'results.log');

// set default log level.
var logLevel = 'info'

// Set up logger
var customColors = {
  trace: 'white',
  debug: 'green',
  info: 'blue',
  warn: 'yellow',
  crit: 'red',
  fatal: 'red'
}

var logger = winston.createLogger({
  level: logLevel,
  levels: {
    fatal: 0,
    crit: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
  },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  transports: [

    new (winston.transports.Console)({
      colorize: true,
      timestamp: true
    }),
    dailyRotateFileTransport    //new (winston.transports.File)({ filename: 'somefile.log' })
  ]
})

winston.addColors(customColors)

// Extend logger object to properly log 'Error' types
var origLog = logger.log

logger.log = function (level, msg) {
  if (msg instanceof Error) {
    var args = Array.prototype.slice.call(arguments)
    args[1] = msg.stack
    origLog.apply(logger, args)
  } else {
    origLog.apply(logger, arguments)
  }
}

/* LOGGER EXAMPLES
  var log = require('./log.js')
  log.trace('testing')
  log.debug('testing')
  log.info('testing')
  log.warn('testing')
  log.crit('testing')
  log.fatal('testing')
 */



module.exports = logger