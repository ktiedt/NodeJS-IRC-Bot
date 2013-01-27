/**
 * IRC Class
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 *
 * @author		Shaun Walker
 * @website     http://www.theshaun.com
 * @copyright	Shaun Walker 2012
 */

var sys = require('util'),
	net = require('net'),
	fs = require('fs'),
    user = require ('./user' ),
	channel = require('./channel');

Server = exports.Server = function(config) {
	this.initialize(config);
};

sys.inherits(Server, process.EventEmitter);

Server.prototype.initialize = function(config) {
	this.host = config.host || '127.0.0.1';
	this.port = config.port || 6667;
	this.nick = config.nick || 'MikeBot';
	this.nickPass = config.nickPass || '';
	this.zncIdent = config.zncIdent || '';
	this.username = config.username || 'MikeBot';
	this.realname = config.realname || 'Powered by MikeBot';
	this.command = config.command || '.';
    this.userchannels = config.channels || [];

    // carry over config object to allow plugins to access it
    this.config = config || {};

    // channel constructor and channel hash
    this.channelObj = channel.Channel;
	this.channels = {};

    // user constructor and user hash
    this.userObj = user.User;
    this.users = {};

    // hook and callback arrays
	this.hooks = [];
	this.triggers = [];
	this.replies = [];

	this.connection = null;
	this.buffer = "";
	this.encoding = "utf8";
	this.timeout = 60*60*1000;

	this.debug = config.debug || false;

    /*
     * Hook for User/Channel inits
     */
    if (typeof channel.initialize === "function") {
        channel.initialize(this);
    }
    if (typeof user.initialize === "function") {
        user.initialize(this);
    }

	/*
	 * Boot Plugins
	 */
	this.plugins = [];

	for(var i = 0, z = config.plugins.length; i < z; i++) {
		var p = config.plugins[i];
		this.loadPlugin(p);
	}
};

Server.prototype.connect = function() {
	var c = this.connection = net.createConnection(this.port, this.host);
    c.setEncoding(this.encoding);
    c.setTimeout(this.timeout);

	this.addListener('connect', this.onConnect);
    this.addListener('data', this.onReceive);
    this.addListener('eof', this.onEOF);
    this.addListener('timeout', this.onTimeout);
    this.addListener('close', this.onClose);
};

Server.prototype.disconnect = function(reason) {
    if (this.connection.readyState !== 'closed') {
        this.connection.close();
        sys.puts('disconnected (' + reason + ')');
    }
};

Server.prototype.onConnect = function() {
	sys.puts('connected');
    if(this.zncIdent != '')
    {
  		this.raw('PASS ' + this.zncIdent);
  	}

    this.raw('NICK', this.nick);
    this.raw('USER', this.username, '0', '*', ':' + this.realname);
    if(this.nickPass != '')
    {
  		this.raw('NS id ' + this.nickPass);
  	}

    this.emit('connect');
};

Server.prototype.onReceive = function(chunk) {
	this.buffer += chunk;
    while(this.buffer) {
        var offset = this.buffer.indexOf("\r\n");
        if (offset < 0) {
            return;
        }

        var msg = this.buffer.slice(0, offset);
        this.buffer = this.buffer.slice(offset + 2);

        if (this.debug) {
            sys.puts( "< " + msg);
        }

        msg = this.parse(msg);
        this.onMessage(msg);
    }
};

Server.prototype.onMessage = function(msg) {
	if (this.debug) {
		sys.puts('++ command: ' + msg.command);
		sys.puts('++ arguments: ' + msg.arguments);
		sys.puts('++ prefix: ' + msg.prefix);
		sys.puts('++ lastarg: ' + msg.lastarg);
	}

	var target = msg.arguments[0], // target
		nick = (this.user(msg.prefix) || '').toLowerCase(), // nick
        user = this.users[nick], // user
		m, // message
        command = msg.command, // command
        users = this.users; // user hash

	switch(true){
		case (command === 'PING'):
			this.raw('PONG', msg.arguments);
			break;

		case (command === 'PRIVMSG'):
            if (user) {
                user.update(msg.prefix);
            }
			// Look for triggers
			m = msg.arguments[1];
			if (m.substring( 0, 1 ) == this.command) {
				var trigger = m.split(' ' )[0].substring( 1, m.length);
				if (typeof this.triggers[trigger] != 'undefined') {
					var trig = this.triggers[trigger];

					trig.callback.apply(this.plugins[trig.plugin], arguments);
				}
			}
            if (user == this.nick) {
                this.emit('private_message', msg);
            } else {
			    this.emit('message', msg);
			}
            break;

		case (command === 'JOIN'):
            if (user) {
                user.update(msg.prefix);
                user.join(target);
            } else {
                user = this.users[nick] = new this.userObj(this, nick);
            }
            user.join(target);

			this.emit('join', msg);
			break;

		case (command === 'PART'):
            if (user) {
                user.update(msg.prefix);
                user.part(target);
            }

			this.emit('part', msg);
			break;

		case (command === 'QUIT'):
            if (user) {
                user.update(msg.prefix);
                user.quit(msg)
            }

			this.emit('quit', msg);
			break;

		case (command === 'NICK'):
            if (user) {
                user.update(msg.prefix);
            }

			this.emit('nick', msg);
			break;

        case (/^\d+$/.test(command)):
            this.emit('numeric', msg);
            break;
	}

	this.emit(msg.command, msg);
	this.emit('data', msg);
};

Server.prototype.user = function(mask){
    if (!mask) {
        return;
    }
	var match = mask.match(/([^!]+)![^@]+@.+/);

	if (!match ) {
        return;
    }
	return match[1];
}

Server.prototype.parse = function(text) {
	if (typeof text  !== "string") {
		return false;
    }

	var tmp = text.split(" ");

	if (tmp.length < 2) {
		return false;
    }

	var prefix = null,
        command = null,
	    lastarg = null,
        args = [];

	for (var i = 0, j = tmp.length; i < j; i++) {
		if (i == 0 && tmp[i].indexOf(":") == 0) {
			prefix = tmp[0].substr(1);
        } else if (tmp[i] == "") {
			continue;
        } else if (!command && tmp[i].indexOf(":") != 0) {
			command = tmp[i].toUpperCase();
        } else if (tmp[i].indexOf(":") == 0) {
			tmp[i ] = tmp[ i].substr(1);
			tmp.splice(0, i);
			args.push(tmp.join(" "));
			lastarg = args.length - 1;
			break;
		} else {
			args.push(tmp[i]);
        }
	}

	return {
		prefix: prefix,
		command: command,
		arguments: args,
		lastarg: lastarg,
		orig: text
	};
};

Server.prototype.onEOF = function() {
    this.disconnect('EOF');
};

Server.prototype.onTimeout = function() {
    this.disconnect('timeout');
};

Server.prototype.onClose = function() {
    this.disconnect('close');
};

Server.prototype.raw = function(cmd) {
    if (this.connection.readyState !== "open") {
        return this.disconnect("cannot send with readyState " + this.connection.readyState);
    }

    var msg = Array.prototype.slice.call(arguments, 1).join(' ') + "\r\n";

    if (this.debug) {
        sys.puts('>' + cmd + ' ' + msg);
    }

    this.connection.write(cmd + " " + msg, this.encoding);
};

// public method to send PRIVMSG cleanly
Server.prototype.send = function(target, msg) {
    msg = Array.prototype.slice.call(arguments, 1).join(' ') + "\r\n";

    if (arguments.length > 1) {
        this.raw('PRIVMSG', target, ':' + msg);
    }
};

Server.prototype.addListener = function(ev, f) {
	var that = this;
	return this.connection.addListener(ev, (function() {
		return function() {
			f.apply(that, arguments);
		};
	})());
};

Server.prototype.addPluginListener = function(plugin, ev, f) {
	if (typeof this.hooks[plugin ] == 'undefined') {
        this.hooks[plugin] = [];
    }

	var callback = (function() {
		return function() {
			f.apply(that, arguments);
		};
	})();

	this.hooks[plugin ].push({event: ev, callback: callback});

	var that = this.plugins[plugin];
	return this.on(ev, callback);
};

Server.prototype.unloadPlugin = function(name) {
	if (typeof this.plugins[name] != 'undefined') {
		delete this.plugins[name];

		if (typeof this.hooks[name] != 'undefined') {

			for(var hook in this.hooks[name]) {

				this.removeListener(this.hooks[name ][ hook ].event, this.hooks[ name ][ hook].callback);

			}

		}

		if (typeof this.replies[name] != 'undefined') {

			for(var reply in this.replies[name]) {

				this.removeListener(this.replies[name ][ reply ].event, this.replies[ name ][ reply].callback);

			}

		}

		for(var trig in this.triggers) {

			if (this.triggers[trig].plugin == name) {

				delete this.triggers[trig];

			}

		}

	}


};

Server.prototype.loadPlugin = function(name) {
    this.unloadPlugin(name);
	var that = this;
	fs.readFile('./plugins/' + name + '.js', 'utf8', function( err, data) {
		if (err) {
			sys.puts(err);
		} else {
			eval(data);
			that.plugins[name] = new Plugin(that);

			/*
			 * Hooks
			 */
            ['connect', 'data', 'numeric', 'message', 'join', 'part', 'quit', 'nick', 'privateMessage'].forEach(function(event) {
                var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
                    callback = this.plugins[name][onEvent];

                if (typeof callback == 'function') {
                    this.addPluginListener(name, event, callback);
                }
            }, that);
		}
	});
};

Server.prototype.addTrigger = function(plugin, trigger, callback) {
	if (typeof this.triggers[trigger] == 'undefined') {
		this.triggers[trigger ] = { plugin: plugin.name, callback: callback};
	}
};

/*
 * DEPRECATED: use "onNumeric" hooks in your plugins
 *      Will be removed
 */
Server.prototype.onReply = function(plugin, ev, f) {
	if (typeof this.replies[plugin ] == 'undefined') this.replies[ plugin] = [];

	var callback = (function() {

		return function() {
			f.apply(that, arguments);
		};

	} )();

	this.replies[plugin ].push({ event: ev, callback: callback});

	var that = this.plugins[plugin];
	return this.on(ev, callback);

};
