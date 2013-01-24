/**
 * IRC Bot
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var sys = require('util'),
	irc = require('./irc'),
	pkgconfig = require('pkgconfig');
	argv = require('optimist').default('conf', 'config').argv; // alternative: nconf

var confName = argv.conf;

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

/**
 * Let's power up
 */
var ircClient = new irc.Server(config);
ircClient.connect();