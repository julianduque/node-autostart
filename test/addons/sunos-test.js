//
// SunOS Addon Test
//
var autostart = require('../../lib/autostart'),
    should    = require('chai').should(),
    assert    = require('chai').assert,
    rimraf    = require('rimraf'),
    path      = require('path'),
    fs        = require('fs'),
    sunos     = require('../../lib/autostart/sunos.js');

//
// Change Root
//
autostart.config.set('root', path.join(__dirname, '..', 'root'));

var autostartManifest = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'sunos', 'autostart.xml'), 'utf8'),
    autostartScript   = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'sunos', 'autostart.sh'), 'utf8'),
    root              = autostart.config.get('root'),
    command           = "node app.js",
    service = {
      start: "node app.js",
      stop: "exit 0"
    };

describe('SunOS Addon', function () {
  describe('#autostart()', function () {
    it('should exist', function () {
      should.exist(sunos.autostart);
    });

    before(function (next) {
      sunos.autostart(command, function (err) {
        assert.ok(!err);
        next();
      });
    });

    after(function (next) {
      if (root != '/') {
        rimraf(path.join(root, 'opt'), next);
      }
    });

    it('should install autostart manifest', function () {
      var manifest = fs.readFileSync(path.join(root, 'opt', 'custom', 'smf', 'autostart.xml'), 'utf8');
      assert.equal(autostartManifest, manifest);
    });

    it('should install autostart script', function () {
      var script = fs.readFileSync(path.join(root, 'opt', 'custom', 'bin', 'autostart.sh'), 'utf8');
      assert.equal(autostartScript, script);
    });
  });

  describe('#service()', function () {
    it('should exist', function () {
      should.exist(sunos.service);
    });
  });
});
