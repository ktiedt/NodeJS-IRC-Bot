var irc  = require('./irc-stub.js'),
    trac = require('../plugins/trac.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("Trac", function(){
    var config = { };
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _trac;

    beforeEach(function() {
        _irc = new irc.Server(config);
        _trac = new trac.Plugin(_irc, 'trac');    
    })

    it('should have a name', function() {
        JSON.stringify('trac').should.equal(JSON.stringify(_trac.name));
    }),
    it('should have a version', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_trac.version));
    }),
    it('should have a title', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_trac.title));
    }),
    it('should have an author', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_trac.author));
    })

});