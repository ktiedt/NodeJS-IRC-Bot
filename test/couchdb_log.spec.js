var irc  = require('./irc-stub.js'),
    couchdb_log = require('../plugins/couchdb_log.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("CouchDB Log", function(){
    var config = { };
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _couchdb_log;

    beforeEach(function() {
        _irc = new irc.Server(config);
        _couchdb_log = new couchdb_log.Plugin(_irc, 'couchdb_log');    
    })

    it('should have a name', function() {
        JSON.stringify('couchdb_log').should.equal(JSON.stringify(_couchdb_log.name));
    }),
    it('should have a version', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_couchdb_log.version));
    }),
    it('should have a title', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_couchdb_log.title));
    }),
    it('should have an author', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_couchdb_log.author));
    })

});