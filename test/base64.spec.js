var irc  = require('./irc-stub.js'),
    base64 = require('../plugins/base64.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("Base64", function(){
    var config = { };
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _base64;

    beforeEach(function() {
        _irc = new irc.Server(config);
        _base64 = new base64.Plugin(_irc, 'base64');    
    })

    it('should have a name', function() {
        JSON.stringify('base64').should.equal(JSON.stringify(_base64.name));
    }),
    it('should have a version', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_base64.version));
    }),
    it('should have a title', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_base64.title));
    }),
    it('should have an author', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_base64.author));
    })

});