/**
 * Help Plugin - Prints differnt help messages on the 
 * IRC channel (as a privmessage)
 *
 * @author		Markus M. May
 * @website		http://www.javafreedom.org
 * @copyright	Markus M. May 2013
 */
var sys = require('util');

Plugin = exports.Plugin = function(irc) {
	this.name = 'help';
	this.title = 'Help Messages';
	this.version = '0.1';
	this.author = 'Markus M. May';
    this.irc = irc;

    this.help = 'This plugin provides the functionality to use the ' + irc.config.command + 'help command';
    this.helpCommands = [irc.config.command + 'help - lists the existing plugins and their commands'];

    irc.addTrigger(this, 'help', this.trigHelp);
};

Plugin.prototype.trigHelp = function(msg) {
    sys.puts( "<trigHelp called " + msg)
	
    var irc = this.irc, // irc object
	    c = msg.arguments[0], // channel
        chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
        params = m.split(' ');

	params.shift();
    sys.puts("params: " + params[0]);
    if (typeof params[0] == 'undefined') {
        irc.send(u, '\002Available Plugins\002 and their commands:');
        for(var name in irc.plugins) {
            if (name == 'global') continue;
            var plugin = irc.plugins[name];
            irc.send(u, 'Plugin: ' + plugin.name + ' - ' + plugin.title + 
                ' - v' + plugin.version + ' by ' + plugin.author);

            var helpMessage = plugin.help;                        
            if (typeof helpMessage !== 'undefined') {
                irc.send(u, helpMessage);
            }

            var helpCommands = plugin.helpCommands;
            if (typeof helpCommands !== 'undefined') { 
                for (i in helpCommands) {
                    irc.send(u, helpCommands[i]);
                }
            }

        }
    } else {
		chan.send('The word \002' + params[0] + '\002 is no longer allowed in here!');
    }
};