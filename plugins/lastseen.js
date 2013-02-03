/**
 * Last Seen Plugin
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var sys = require('util');

Plugin = exports.Plugin = function(ph) {
	this.ph = ph;
	this.name = this.ph.name;

	this.title = 'Last Seen';
	this.version = '0.1';
	this.author = 'Michael Owens';

	this.seen = [];

	this.ph.irc.addTrigger(this, 'lastseen', this.trigLastSeen);

};

Plugin.prototype.onMessage = function(msg) {
	this.updateUser(msg);
};

Plugin.prototype.onJoin = function(msg) {
	this.updateUser(msg);
};

Plugin.prototype.onPart = function(msg) {
	this.updateUser(msg);
};

Plugin.prototype.onQuit = function(msg) {
	this.updateUser(msg);
};

Plugin.prototype.onNick = function(msg) {
	this.updateUser(msg, true);
};

Plugin.prototype.updateUser = function(msg, argument) {

	var u = this.ph.irc.user(msg.prefix);
    console.log(u, msg.prefix);
	this.seen[u.toLowerCase()] = new Date();

	if (typeof argument != 'undefined') {
		var u = msg.arguments[0];

		this.seen[u.toLowerCase()] = new Date();
	}
}

Plugin.prototype.trigLastSeen = function(msg) {
	var c = msg.arguments[0], // channel
		u = this.ph.irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
        chan = this.ph.irc.channels[c], // channel object
        params = m.split(' ');

	params.shift();

	if (typeof params[0] == 'undefined') {
		chan.send('\002Example:\002 ' + this.irc.config.command + 'seen <name>');
	} else {
		var seek = params[0].toLowerCase();

		if (typeof this.seen[seek] == 'undefined') {
			chan.send('I have not seen \002' + params[ 0] + '\002 around here!');
		} else {
			var dat = this.seen[seek],
			    lastDate = dat.getDate() + '-' + (dat.getMonth() + 1) + '-' + dat.getFullYear(),
			    lastTime = dat.getHours() + ':' + dat.getMinutes() + ':' + dat.getSeconds();

			chan.send('I have seen \002' + params[ 0] + '\002 around here the last time on the: \002' + lastDate + '\002 at \002' + lastTime + '\002');
		}
	}
};