/**
 * IRC Bot
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var sys = require('util'),
	irc = require('./lib/irc'),
	pkgconfig = require('pkgconfig'),
    winston = require('winston'),
	argv = require('optimist').default('config', 'config').argv; // alternative: nconf

var confName = argv.config;

/**
 * More advanced config
 *
 * we should provide a way to "enable" environment specific configs (like
 * found on rails apps)
 */
 var options = {
    schema: 'config/schema.json',
    config: 'config/' + confName + '.json'
 };

var config = pkgconfig(options);

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: config.logLevel })
//      new (winston.transports.File)({ level: config.logLevel, filename: 'ircbot.log' })
    ]
});

config.logger = logger;

/**
 * Let's power up
 */
var ircClient = new irc.Server(config);
ircClient.connect();