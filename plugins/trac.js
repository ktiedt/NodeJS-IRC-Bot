/**
 * Trac Plugin
 *
 * @author		Karl Tiedt
 * @website		http://twitter.com/ktiedt
 * @copyright	Karl Tiedt 2011
 *
 * nemesis: prevent responses to #ticket in line if this bot is present in the channel
 * prefix: instead of matching raw #1345 in random text, (unless directly addressed via dojoBot: or dojoBot, it watches for prefix#1234
 * host: Base URL for trac instance
 */

var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
    Plugin.super_.call(this, irc, name);

	this.title = 'Trac Interface';
	this.version = '0.1';
	this.author = 'Karl Tiedt';

    this.host = 'http://bugs.dojotoolkit.org';
    this.prefix = 'trac'; // allow inline matching via trac[changeset] or trac#ticket
    this.nemesis = 'dojogurl'; // do not announce tickets of this user is on the channel

    this.irc.addTrigger(this, 'ticket', this.ticket);
    this.irc.addTrigger(this, 'changeset', this.changeset);
};

util.inherits(Plugin, basePlugin.BasePlugin);

Plugin.prototype.ticket = function(msg) {
	var irc = this.irc,
        user = irc.user.apply(irc, [msg.prefix]), // user
        args = msg.arguments,
		target = (args[0] === irc.nick ? user : args[0]), // target
		message = args[1], // message
		params = message.split(' '),
		send = irc.send;

	args[0] = target;
	params.shift();
	if (typeof params[0] == 'undefined') {
		send(target, '\002Usage:\002', irc.command + 'ticket #defect');
	} else {
		var defect = params[0].replace('#', '').trim();

		this.announceTicket.apply(this, [defect, msg]);
	}
};

Plugin.prototype.changeset = function(msg) {
	var irc = this.irc,
        user = irc.user(msg.prefix), // user
        args = msg.arguments,
		target = (args[0] === irc.nick ? user : args[0]), // target
		message = args[1], // message
		params = message.split(' ');

	args[0] = target;
	params.shift();
	if (typeof params[0] == 'undefined') {
		irc.send(target, '\002Usage:\002', irc.command + 'chanageset [changeset]>');
	} else {
		var changeset = params[0].replace(/[\[\]]/g, '').trim();

		this.announceChangeset.apply(this, [changeset, msg]);
	}
};

Plugin.prototype.onMessage = function(msg) {
	var args = msg.arguments,
        nick = this.irc.nick,
        chan = args[0],
        params = args[1].split(' '),
        toMe = (params[0].indexOf(nick) === 0 && (params[0].length === nick.length+1 && /^[,:]$/.test(params[0].substr(-1)))),
        message = toMe ? params.splice(1).join(' ') : params.join(' '),
        ticketRegex = toMe ? /trac#(\d+)|#(\d+)/ : /trac#(\d+)|^#(\d+)/,
        changesetRegex = toMe ? /trac\[(\d+)\]|\[(\d+)\]/ :  /trac\[(\d+)\]|^\[(\d+)\]/,
		ticketResults = ticketRegex.exec(args.length === 2 ? message : ''),
		changesetResults = changesetRegex.exec(args.length === 2 ? message : ''),
        nemesis = this.irc.users[this.nemesis];

	if (ticketResults) {
		if (nemesis.isOn(chan) && !toMe) {
            return;
        } else {
            this.announceTicket(ticketResults[1] || ticketResults[2], msg);
        }
	}
	if (changesetResults) {
		this.announceChangeset(changesetResults[1] || changesetResults[2], msg);
	}
};

Plugin.prototype.announceChangeset = function(changeset, msg) {
	var jsdom = require("jsdom"),
        irc = this.irc,
		target = msg.arguments[0], // target
        user = irc.user(msg.prefix), // nick who triggered
		trac = this.host + '/changeset/' + changeset;

	if (changeset && changeset.length && /^\d+$/.test(changeset)) {
		jsdom.env(trac, ["http://code.jquery.com/jquery-1.5.min.js"],
		function(errors, window) {
            var date = new Date(window.$('.time .timeline')[0].getAttribute('title').split(' ')[0].trim()).toGMTString(),
                message = window.$('.message.searchable')[0].textContent.trim();

			irc.send.apply(irc, [target, user + ':', message, ' - Checked in at', date, '- see:', trac]);
		});
	}
};

Plugin.prototype.announceTicket = function(defect, msg) {
	var http = require("http"),
		params = '{"params": [%defect%], "method": "ticket.get"}'.replace('%defect%', defect),
		target = msg.arguments[0], // target
		options = {
			host: 'bugs.dojotoolkit.org',
			port: 80,
			path: '/rpc',
			method: 'POST',
			headers: {'content-type':'application/json', 'content-length':params.length}
		},
		href = "http://bugs.dojotoolkit.org/ticket/" + defect,
        irc = this.irc,
		user = irc.user(msg.prefix),
		send = irc.send,
		req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				var data = JSON.parse(chunk);

				if (data.result) {
					data = data.result;
					for(var i=0;i < data.length; i++) {
						if (data[i].status) {
							data = data[i];
							break;
						}
					}
						send.apply(irc, [target, user, ':', data.summary, '- [' + data.status + '] - last Updated:', new Date(data._ts).toGMTString(), '- see: http://bugs.dojotoolkit.org/ticket/' + defect]);
				} else {
					send.apply(irc,[target, data.error.message]);
				}
			});
		});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.write(params);
	// req.write('data\n');
	req.end();
};