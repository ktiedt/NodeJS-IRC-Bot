/**
 * FreeNode Services Plugin
 *
 * @author		Karl Tiedt
 * @website		http://twitter.com/ktiedt
 * @copyright	Karl Tiedt 2011
 *
 * Identifies to nickserv on FreeNode onConnect
 *      update nickPass as needed
 */
var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
    Plugin.super_.call(this, irc, name);

    this.title = 'FreeNode Services';
    this.version = '0.1';
    this.author = 'Karl Tiedt';

    try {
        this.nickPass = this.getPluginProperty('nickPass');
    } catch (e) {
        this.irc.logger.error('Cannot load config options of freenode plugin.', e);
    }

    this.irc.addTrigger(this, 'nickserv', this.trigNickServ);
};

util.inherits(Plugin, basePlugin.BasePlugin);

Plugin.prototype.onConnect = function() {
    if (typeof this.nickPass != 'undefined') {
        this.nickServLogin();    
    } 
};

Plugin.prototype.nickServLogin = function() {
    this.irc.raw('NS id ' + this.nickPass);
}

Plugin.prototype.trigNickServ = function(msg) {
    var m = msg.arguments[1], // message 
        params = m.split(' '),
        irc = this.irc;

    params.shift();

    if (typeof params[0] == 'undefined') {
        chan.send('\002Example:\002 ' + this.irc.config.command + 'freenode <command> <options>');
    } else {
        var seek = params[0].toLowerCase();

        if (seek === 'login') {
            // login to the nickserv server with given nick and password
            this.nickServLogin();
        } else if (seek === 'release') {
            // release a used nick
            if (typeof params[1] !== 'undefined') {
                this.irc.raw('NS release ' + params[1]);
            }
        } else if (seek === 'passwd') {
            // change password with the given one
            if (typeof params[1] !== 'undefined') {
                this.irc.raw('NS SET PASSWORD ' + params[1]);
            }
        }
    }
}