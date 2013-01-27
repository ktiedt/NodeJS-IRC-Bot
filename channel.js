/**
 * Channel Class
 *
 * @author      Karl Tiedt
 * @website     http://twitter.com/ktiedt
 * @copyright
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var sys = require('util');

// to prevent onReply from happening more than once
var _init = false;
exports.initialize = function(irc) {
    var _this = irc;
    irc.on('numeric', function(msg) {
        var command = msg.command;
        if (command !== '353') {
            return;
        }

        var chan = msg.arguments[2],
            // replace + and @ prefixes for channel privs, we only want the nick
            nicks = msg.arguments[3].replace(/\+|@/g, '').split(' '),
            chans = _this.channels,
            user = null,
            allusers = _this.users,
            nick;

        // TODO: support all channel prefixes - need to find proper documentation to list these
        if (!chan || chan.charAt(0) !== '#') {
            return;
        }
        chan = chans[chan];
        for(var i=0; i<nicks.length; i++) {
            nick = nicks[i].toLowerCase();
            user = allusers[nick];
            if (!user) {
                user = allusers[nick] = new _this.userObj(_this, nicks[i]);
            }
            user.join(chan.name);
        }
    });
};

Channel = exports.Channel = function(irc, room, join, password) {
	this.irc = irc;
	this.name = room;
	this.inRoom = false;
	this.password = password;
    this.users = [];

	if (join ) {
        this.join();
    }
};

Channel.prototype.join = function() {
	var chans = this.irc.channels,
        name = this.name;

    chans[name] = this;
	this.irc.raw('JOIN', name, this.password);
	this.inRoom = true;
};

Channel.prototype.part = function(msg) {
	var user = null,
        users = [].concat(this.users),
        userCount = users.length,
        allusers = this.irc.users,
        chans = this.irc.channels;

	this.irc.raw('PART', this.name, ':' + msg);
	this.inRoom = false;

    for(var i=0; i<userCount;i++) {
        user = allusers[users[i]];
        // if user is only in 1 channel and channel is this one
        if (user.isOn(this.name)) {
            user.part(this);
        }
    }
};

Channel.prototype.send = function(msg) {
	this.irc.send(this.name, msg);
};