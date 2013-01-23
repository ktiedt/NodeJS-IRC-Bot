/**
 * Reload Plugin
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var sys = require('util');

Plugin = exports.Plugin = function(irc) {
	this.name = 'reload';
	this.title = 'Plugin Reloader';
	this.version = '0.2';
	this.author = 'Michael Owens';

	this.irc = irc;

    this.help = 'This plugin provides the functionality to reload plugins on demand.';
    this.helpCommands = [irc.config.command + 'reload - reloads a given plugin', 
                         irc.config.command + 'unload - unloads a given plugin'];    

	this.irc.addTrigger(this, 'reload', this.reloadPlugin);
    this.irc.addTrigger(this, 'unload', this.unloadPlugin);
};

Plugin.prototype.reloadPlugin = function(msg) {
	var irc = this.irc, // irc object
        c = msg.arguments[0], // channel
        chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
        params = m.split(' ');

	params.shift();
	irc.send(chan && chan.name || u, 'reloading plugin: ' + params[0]);
	irc.loadPlugin(params[0]);


};

Plugin.prototype.unloadPlugin = function(msg) {
	var irc = this.irc, // irc object
	    c = msg.arguments[0], // channel
        chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
        params = m.split(' ');

	params.shift();
	irc.send(chan && chan.name || u, 'unloading plugin: ' + params[ 0]);
    irc.unloadPlugin(params[0]);
};
