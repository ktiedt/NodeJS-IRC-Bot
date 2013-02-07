/**
 * CouchDB Seen Plugin
 *
 * @author		Karl Tiedt
 * @website		http://twitter.com/ktiedt
 * @copyright	Karl Tiedt 2011
 *
 */
var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
    Plugin.super_.call(this, irc, name);

	this.title = 'CouchDB Seen';
	this.version = '0.1';
	this.author = 'Karl Tiedt';

    if (this.irc.config.plugins.indexOf("couchdb_log") === -1) {
        throw(this.name + ": requires couchdb_log plugin to be installed as well");
    }

    // document fields saved from the couchdb_log plugin
    this.fields = ['nick', 'channel', 'host', 'date', 'message', 'type'];

    this.db = irc.couchdb;
    this.irc.addTrigger( this, 'seen', this.seen );
};
util.inherits(Plugin, basePlugin.BasePlugin);

// Trigger for seen behavior
Plugin.prototype.seen = function(msg) {
	var irc = this.irc, // irc object
        db = irc.couchdb, // database object
	    user = irc.user(msg.prefix), // user
        args = msg.arguments,
		target = (args[0] === irc.nick ? user : args[0]), // target
		message = args[1], // message
		params = message.split(' '),
		_this = this;

	params.shift();
	if (typeof params[0] == 'undefined') {
		irc.send(target, user + ':', this.processSeen({}, 'USAGE'));
	} else {
		var seen = params[0];

		db.view("log/byUser", {endkey:[seen], startkey:[seen + " "], descending:true}, function(err, res) {
			if (!res.length) {
				irc.send(target, user + ':', _this.processSeen({nick: seen}, 'NEGATIVE'));
				return;
			}

            var doc = res[0].value;

            doc.date = new Date(doc.date).toGMTString();
			irc.send(target, user + ':', _this.processSeen(doc));
		});
	}
};

// Processes a document object and returns a formatted string based on those values and optional type passed
//      If doc.type is not set, type is used instead -- see USAGE and NEGATIVE uses above for examples
Plugin.prototype.processSeen = function(doc, type) {
    var irc = this.irc,
        formats = {
            'USAGE': 'Usage: ' + irc.command + 'seen <nick>',
            'NEGATIVE': 'I have never seen ${nick}, my apologies.',
            'PRIVMSG': '${nick} was last seen chatting in ${channel} at ${date}.',
            'JOIN': '${nick} was last seen joining ${channel} at ${date}.',
            'PART': '${nick} was last seen leaving ${channel} at ${date}.',
            'QUIT': '${nick} was last seen quiting IRC at ${date}.',
            'NICK': '${nick} was last seen changing nicks to ${message} at ${date}.'
        },
        response = formats[type || doc.type];

    this.fields.forEach(function(field) {
        var regex = new RegExp('\\${' + field + '}', 'g');
        response = response.replace(regex, doc[field] || "");
    });
    return response;
};