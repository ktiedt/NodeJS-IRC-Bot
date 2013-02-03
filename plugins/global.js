/**
* Global Functionalities and Boot Up
*
* @author		Michael Owens
* @website		http://www.michaelowens.nl
* @copyright	Michael Owens 2011
*/
var sys = require('util');

Plugin = exports.Plugin = function(ph) {
    this.ph = ph;
	this.name = this.ph.name;

	this.title = 'Global';
	this.version = '0.1';
	this.author = 'Michael Owens';
};

Plugin.prototype.onNumeric = function(msg) {
    var command = msg.command;

    // 376 is end of MOTD/modes
    if (command !== '376') {
        return;
    }

    var irc = this.ph.irc, // irc object
        userchans = irc.userchannels; // userchannels

    for (var i = 0; i < userchans.length; i++) {
        var channelName = userchans[i], password;

        if (typeof(channelName) == "object") {
            password = channelName.password;
            channelName = channelName.name;
        }

        var chan = new irc.channelObj(irc, channelName, true, password);
        irc.channels[chan.name] = chan;
    }
};