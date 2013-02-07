var irc  = require('./irc-stub.js'),
    ball = require('../plugins/8ball.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("8ball", function(){
    var config = {};
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _8ball;

    beforeEach(function() {
        _irc = new irc.Server(config);
        _8ball = new ball.Plugin(_irc, '8ball');    
    })

    it('should have a name', function() {
        JSON.stringify('8ball').should.equal(JSON.stringify(_8ball.name));
    }),
    it('should have a version', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_8ball.version));
    }),
    it('should have a title', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_8ball.title));
    }),
    it('should have an author', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_8ball.author));
    })

});