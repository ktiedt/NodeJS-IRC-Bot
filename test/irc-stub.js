/**
 * IRC Class Stub - provide only functions used by plugins
 *
 * @author      Markus M. May
 * @website     http://www.javafreedom.org
 * @copyright   Markus M. May 2013
 */
var util = require('util'),
    channel = require('../lib/channel.js'),
    winston = require('winston'),
    origIRC = require('../lib/irc.js');


Server = exports.Server = function(config) {
    var logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: "error" })
        ]
    });

    config.command = "!";

    this.logger = logger;

    this.initialize(config);
};

util.inherits(Server, process.EventEmitter);

Server.prototype.initialize = function(config) {
    // user constructor and user hash
    this.nick = 'stubBotNick';

    this.command = '!';

    // Initialize channels
    this.channels = {};
    this.channels['#stubChannel'] = new channel.Channel(this, '#stubChannel', false);
    this.channels['#stubChannel1'] = new channel.Channel(this, '#stubChannel1', false);

    this.triggers = {};

    this.resultMessage = 'NOTHING HAPPENED';

    this.config = config;
};

Server.prototype.user = function(nick){
    return nick;
}

Server.prototype.addTrigger = function(plugin, trigger, callback) {
    if (typeof this.triggers[trigger] == 'undefined') {
        this.triggers[trigger ] = { plugin: plugin.name, callback: callback};
    }
};

Server.prototype.raw = function(cmd) {
//    if (this.connection.readyState !== "open") {
//        return this.disconnect("cannot send with readyState " + this.connection.readyState);
//    }
    var msg = Array.prototype.slice.call(arguments, 1).join(' ') + "\r\n";
    this.resultMessage = cmd + " " + msg, this.encoding;
};

// public method to send PRIVMSG cleanly
Server.prototype.send = function(target, msg) {

    msg = Array.prototype.slice.call(arguments, 1).join(' ') + "\r\n";

    if (arguments.length > 1) {
        this.raw('PRIVMSG', target, ':' + msg);
    }
};

function parse(text) {
    return origIRC.parse(text);
};

exports.parse = parse;