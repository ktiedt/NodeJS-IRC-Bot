var irc  = require('../lib/irc.js');
var should = require('should');
var _ = require('underscore');

describe("IRC", function() {
    describe("#parse()", function() {
        it("Parsing IRC messages and split those into its details", function() {
            var checks = {
                ':irc.dollyfish.net.nz 372 nodebot :The message of the day was last changed: 2012-6-16 23:57': {
                    prefix: "irc.dollyfish.net.nz",
                    command: "372",
                    arguments: [ "nodebot", "The message of the day was last changed: 2012-6-16 23:57" ],
                    lastarg: 1,
                    orig: ":irc.dollyfish.net.nz 372 nodebot :The message of the day was last changed: 2012-6-16 23:57"
                },
                ':Ned!~martyn@irc.dollyfish.net.nz PRIVMSG #test :Hello nodebot!': {
                    prefix: "Ned!~martyn@irc.dollyfish.net.nz",
                    command: "PRIVMSG",            
                    arguments: [ "#test", "Hello nodebot!" ],
                    lastarg: 1,
                    orig: ":Ned!~martyn@irc.dollyfish.net.nz PRIVMSG #test :Hello nodebot!"
                },
                ':Ned!~martyn@irc.dollyfish.net.nz PRIVMSG #test ::-)': {
                    prefix: "Ned!~martyn@irc.dollyfish.net.nz",
                    command: "PRIVMSG",
                    arguments: [ "#test", ":-)" ],
                    lastarg: 1,
                    orig: ":Ned!~martyn@irc.dollyfish.net.nz PRIVMSG #test ::-)"
                },
                ':Ned!~martyn@irc.dollyfish.net.nz PRIVMSG #test ::': {
                    prefix: "Ned!~martyn@irc.dollyfish.net.nz",
                    command: "PRIVMSG",
                    arguments: [ "#test", ":" ],
                    lastarg: 1,
                    orig: ":Ned!~martyn@irc.dollyfish.net.nz PRIVMSG #test ::"
                },
                ":Ned!~martyn@irc.dollyfish.net.nz PRIVMSG #test ::^:^:": {
                    prefix: "Ned!~martyn@irc.dollyfish.net.nz",
                    command: "PRIVMSG",
                    arguments: [ "#test", ":^:^:" ],
                    lastarg: 1,
                    orig: ":Ned!~martyn@irc.dollyfish.net.nz PRIVMSG #test ::^:^:"
                },
                ":some.irc.net 324 webuser #channel +Cnj 5:10": {
                    prefix: "some.irc.net",
                    command: "324",
                    arguments: [ "webuser", "#channel", "+Cnj", "5:10" ],
                    lastarg: null,
                    orig: ":some.irc.net 324 webuser #channel +Cnj 5:10"
                },
                ":nick!user@host QUIT :Ping timeout: 252 seconds": {
                    prefix: "nick!user@host",
                    command: "QUIT",
                    arguments: [ "Ping timeout: 252 seconds" ],
                    lastarg: 0,
                    orig: ":nick!user@host QUIT :Ping timeout: 252 seconds"
                },
                ":nick!user@host PRIVMSG #channel :so : colons: :are :: not a problem ::::": {
                    prefix: "nick!user@host",
                    command: "PRIVMSG",
                    arguments: [ "#channel", "so : colons: :are :: not a problem ::::" ],
                    lastarg: 1,
                    orig: ":nick!user@host PRIVMSG #channel :so : colons: :are :: not a problem ::::"
                },
                ":pratchett.freenode.net 324 nodebot #ubuntu +CLcntjf 5:10 #ubuntu-unregged": {
                    prefix: 'pratchett.freenode.net',
                    command: '324',
                    arguments: [ 'nodebot', '#ubuntu', '+CLcntjf', '5:10', '#ubuntu-unregged' ],
                    lastarg: null,
                    orig: ":pratchett.freenode.net 324 nodebot #ubuntu +CLcntjf 5:10 #ubuntu-unregged"
                }
            };

            _.each(checks, function(result, line) {
                JSON.stringify(result).should.equal(JSON.stringify(irc.parse(line)));
            });

        })
    });
});