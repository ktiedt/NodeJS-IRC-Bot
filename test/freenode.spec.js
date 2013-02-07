var irc  = require('./irc-stub.js'),
    freenode = require('../plugins/freenode.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("Freenode", function(){
    var config = { "pluginConfigs": {
                        "freenode": {
                            "nickPass": "defaultPassword"
                        }
                    }
                };
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _freenode;

    beforeEach(function() {
        _irc = new irc.Server(config);
        _freenode = new freenode.Plugin(_irc, 'freenode');    
    })

    describe("#onConnect", function() {
        it('should send the password to the server', function() {
            var call = _freenode.onConnect();
            var resultMessage = _irc.resultMessage;
            var result = "NS id defaultPassword \r\n";
            JSON.stringify(result).should.equal(JSON.stringify(resultMessage));
        })
    }),
//    it('should be possible to configure the password from outside', function() {
//        var config = { plugins: { freenode: { nickPass: 'aConfiguredPassword'}}};        
//        _irc = new irc.Server(config);
//        _freenode = new freenode.Plugin(_irc);
//        JSON.stringify('aConfiguredPassword').should.equal(JSON.stringify(_freenode.nickPass));
//    }),    
    it('should have a name', function() {
        JSON.stringify('freenode').should.equal(JSON.stringify(_freenode.name));
    }),
    it('should have a version', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_freenode.version));
    }),
    it('should have a title', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_freenode.title));
    }),
    it('should have an author', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_freenode.author));
    }),
    it('should have a default password', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_freenode.nickPass));        
    })

});