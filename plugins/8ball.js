/**
 * 8 Ball Plugin
 *
 * @author		Shaun Walker
 * @website		http://www.theshaun.com
 * @copyright	Shaun Walker 2013
 */
var util = require('util'),
	basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
	Plugin.super_.call(this, irc, name);
	
	this.title = '8 Ball';
	this.version = '0.1';
	this.author = 'Shaun Walker';

	this.seen = [];

	this.irc.addTrigger(this, '8ball', this.trig8Ball);
};
util.inherits(Plugin, basePlugin.BasePlugin);

Plugin.prototype.trig8Ball = function(msg) {
	var c = msg.arguments[0], // channel
		u = this.irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
        chan = this.irc.channels[c], // channel object
        params = m.split(' ');

	params.shift();

	if (typeof params[0] == 'undefined') {
		chan.send('\002Example:\002 ' + this.irc.config.command + '8ball <phrase>');
	} else {

		var lines = [
			"Ask again later",
			"Better not tell you now",
			"Concentrate and ask again",
			"Don't count on it",
			"It is certain",
			"Most likely",
			"My reply is no",
			"My sources say no",
			"No",
			"Outlook good",
			"Outlook not so good",
			"Reply hazy, try again",
			"Signs point to yes",
			"Yes",
			"Yes, definitely",
			"You may rely on it"
		];

		var item = lines[Math.floor(Math.random()*lines.length)];
		chan.send(item);

	}
};