var irc  = require('./irc-stub.js'),
    lastseen = require('../plugins/lastseen.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("Lastseen", function(){
    var config = {};
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _lastseen;

    beforeEach(function() {
        _irc = new irc.Server(config);
        _lastseen = new lastseen.Plugin(_irc, 'lastseen');    
    })

    it('should have a name', function() {
        JSON.stringify('lastseen').should.equal(JSON.stringify(_lastseen.name));
    }),
    it('should have a version', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_lastseen.version));
    }),
    it('should have a title', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_lastseen.title));
    }),
    it('should have an author', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_lastseen.author));
    })

});