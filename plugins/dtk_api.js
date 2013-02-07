/**
 * Dojo Toolkit Api Plugin
 *
 * @author		Karl Tiedt
 * @website		http://twitter.com/ktiedt
 * @copyright	Karl Tiedt 2011
 *
 * host: Base URL for website instance
 */

var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
    Plugin.super_.call(this, irc, name);

	this.title = 'Dojo Toolkit API Interface';
	this.version = '0.1';
	this.author = 'Karl Tiedt';

    this.host = 'http://dojotoolkit.org/api/';

    this.irc.addTrigger(this, 'api', this.api);
};
util.inherits(Plugin, basePlugin.BasePlugin);

Plugin.prototype.api = function(msg) {
	var irc = this.irc,
        user = irc.user.apply(irc, [msg.prefix]), // user
        args = msg.arguments,
		target = (args[0] === irc.nick ? user : args[0]), // target
		message = args[1], // message
		params = message.split(' '),
		send = irc.send;

	args[0] = target;
	params.shift();
	if (typeof params[0] == 'undefined') {
		send.apply(irc, [target, '\002Usage:\002', irc.command + 'api <namespace> [anchor]']);
	} else {
		var namespace = params.shift(),
            anchor = params.shift();

        namespace = namespace.replace(/\./g, '/').trim();
        if (anchor) {
            anchor = "#" + anchor;
        }

		irc.send(target, user + ":", this.host + namespace + (anchor ? anchor : ''));
	}
};