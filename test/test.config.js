var should = require('should')
  , config = require('../lib/config');

describe('config#parseArgv', function() {
  var exited = false
    , oldProcessExit = process.exit
    , oldConsoleError = console.error;

  // test process.exit()
  before(function() {
    process.exit = function() {
      exited = true;
      throw new Error();
    };
    console.error = function() {};
  });
  beforeEach(function() {
    exited = false;
  });
  after(function() {
    process.exit = oldProcessExit;
    console.error = oldConsoleError;
  });

  it('default result', function() {
    var conf = config.parseArgv(['node', 'livereloadx']);
    conf.should.have.property('port', 35729);
    conf.should.have.property('verbose', false);
    conf.should.have.property('liveCSS', true);
    conf.should.have.property('liveImg', true);
    conf.should.have.property('dir', '.');
  });

  it('set dir', function() {
    var conf = config.parseArgv(['node', 'livereloadx', 'dir']);
    conf.should.have.property('dir', 'dir');

    conf = config.parseArgv(['node', 'livereloadx', '-p', '1234', 'dir']);
    conf.should.have.property('dir', 'dir');
  });

  it('set static', function() {
    var conf = config.parseArgv(['node', 'livereloadx', '-s']);
    conf.should.have.property('static', true);
  });

  it('set proxy', function() {
    var conf = config.parseArgv(['node', 'livereloadx', '-y', 'http://example.com/']);
    conf.should.have.property('proxy', 'http://example.com/');
    conf.should.have.property('preferLocal', false);
  });

  it('set proxy and prefer-local', function() {
    var conf = config.parseArgv(['node', 'livereloadx', '-y', 'http://example.com/', '-l']);
    conf.should.have.property('proxy', 'http://example.com/');
    conf.should.have.property('preferLocal', true);
  });

  it('set port', function() {
    var conf = config.parseArgv(['node', 'livereloadx', '--port', '80', 'dir']);
    conf.should.have.property('port', 80);

    conf = config.parseArgv(['node', 'livereloadx', '-p', '1234', 'dir']);
    conf.should.have.property('port', 1234);
  });

  it('set verbose', function() {
    var conf = config.parseArgv(['node', 'livereloadx', '-v', 'dir']);
    conf.should.have.property('verbose', true);

    var conf = config.parseArgv(['node', 'livereloadx', '--verbose', 'dir']);
    conf.should.have.property('verbose', true);
  });

  it('set no-liveCSS', function() {
    var conf = config.parseArgv(['node', 'livereloadx', '-C', 'dir']);
    conf.should.have.property('liveCSS', false);

    conf = config.parseArgv(['node', 'livereloadx', '--no-liveCSS', 'dir']);
    conf.should.have.property('liveCSS', false);
  });

  it('set no-liveImg', function() {
    var conf = config.parseArgv(['node', 'livereloadx', '-I', 'dir']);
    conf.should.have.property('liveImg', false);

    conf = config.parseArgv(['node', 'livereloadx', '--no-liveImg', 'dir']);
    conf.should.have.property('liveImg', false);
  });

  it('invalid port', function() {
    (function() {
      config.parseArgv(['node', 'livereloadx', '-p', 'a', 'dir']);
    }).should.throw();
  });

  it('unknown option', function() {
    (function() {
      config.parseArgv(['node', 'livereloadx', '--unknown', 'a', 'dir']);
    }).should.throw();
    exited.should.be.true;
  });

  it('static and proxy', function() {
    (function() {
      config.parseArgv(['node', 'livereloadx', '-s', '-p', 'http://www.example.com/']);
    }).should.throw();
  });

  it('prefer-lcoal and proxy', function() {
    (function() {
      config.parseArgv(['node', 'livereloadx', '-l']);
    }).should.throw();
  });
});

describe('config#setDefaultValue test', function() {
  it('default result', function() {
    var conf = config.setDefaultValue({});
    conf.should.have.property('port', 35729);
    conf.should.have.property('liveCSS', true);
    conf.should.have.property('liveImg', true);
  });

  it('set port', function() {
    var conf = config.setDefaultValue({port: 80});
    conf.should.have.property('port', 80);
  });

  it('set liveCSS', function() {
    var conf = config.setDefaultValue({liveCSS: false});
    conf.should.have.property('liveCSS', false);
  });

  it('set liveImg', function() {
    var conf = config.setDefaultValue({liveImg: false});
    conf.should.have.property('liveImg', false);
  });

  it('invalid key should throw', function() {
    (function() {
      config.setDefaultValue({invalid_key: 1});
    }).should.throw();
  });

  it('invalid type should throw', function() {
    (function() {
      config.setDefaultValue({port: "80"});
    }).should.throw();
  });
});
