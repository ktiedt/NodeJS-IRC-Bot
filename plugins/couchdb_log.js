/**
 * CouchDB Logging Plugin
 *
 * @author		Karl Tiedt
 * @website		http://twitter.com/ktiedt
 * @copyright	Karl Tiedt 2011
 *
 */

var util = require('util'),
	cradle = require('cradle'),
	c = new(cradle.Connection)(),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
    Plugin.super_.call(this, irc, name);

	this.title = 'CouchDB Logging';
	this.version = '0.1';
	this.author = 'Karl Tiedt';

    this.db = c.database('dojobot');

    // fields that are saved to the database documents
    this.fields = ['nick', 'channel', 'host', 'date', 'message', 'type'];

    // store reference to the databse connection for other couchdb plugins
    this.irc.couchdb = this.db;
};
util.inherits(Plugin, basePlugin.BasePlugin);

// onMessage handler for logging
Plugin.prototype.onMessage = function(msg) {
	this.updateLog(msg);
};

// onJoin handler for logging
Plugin.prototype.onJoin = function(msg) {
	this.updateLog(msg);
};

// onPart handler for logging
Plugin.prototype.onPart = function(msg) {
	this.updateLog(msg);
};

// onQuit handler for logging
//      quits are network specific not channel, so null the channel name
Plugin.prototype.onQuit = function(msg) {
	this.updateLog(msg, {channel: '', message: msg.arguments[0]});
};

// onNick handler for nick changes
//      nick changes are not channel specific so null the channel and use the new nick as the message
Plugin.prototype.onNick = function(msg) {
    var irc = this.irc,
        oldnick = irc.user(msg.prefix),
        user = irc.users[oldnick],
        newnick = msg.arguments[0];

    console.log("onNICK: ", oldnick, newnick, typeof irc.users, typeof irc.users[oldnick], typeof irc.users[newnick]);
    // trigger nick change on the User object -- updates all references to oldnick
    user && user.changeNick(newnick);
	this.updateLog(msg, {channel: '', message: newnick});
};

// getNick - generates nick value for database
Plugin.prototype.getNick = function(msg) {
    return this.irc.user(msg.prefix);
};

// getChannel - generate channel value for database
Plugin.prototype.getChannel = function(msg) {
    var args = msg.arguments;

    return args.length ? args[0] : "";
};

// getHost - generate host value for database
Plugin.prototype.getHost = function(msg) {
    return msg.prefix;
};

// getDate - generate date value for database
Plugin.prototype.getDate = function(msg) {
    return new Date();
};

// getMessage - generate message value for database
Plugin.prototype.getMessage = function(msg) {
    var args = msg.arguments;

    return args.length == 2 ? args[1] : "";
};

// getType - generate type value for database
Plugin.prototype.getType = function(msg) {
    return msg.command;
};

// updateLog - compiles complete document object to send to the database
//      if a value exists in doc, it is used instead of the default value, this allows for overriding getXXXX() methods
Plugin.prototype.updateLog = function(msg, doc) {
	var irc = this.irc, // irc object
        db = this.db, // database object
        _this = this;

    doc = doc || {};

    this.fields.forEach(function(field) {
        var f = 'get' + field.charAt(0).toUpperCase() + field.substr(1);

        doc[field] = typeof doc[field] !== "undefined" ? doc[field] : _this[f](msg);
    });

	db.save(doc);
};