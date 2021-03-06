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
    serviceManifest   = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'sunos', 'myapp.xml'), 'utf8'),
    root              = autostart.config.get('root'),
    command           = "node app.js > output",
    service = {
      name: 'myapp',
      start: "node app.js",
      stop: ":kill"
    };
  root              = autostart.config.get('root'),
    command           = "node app.js > output",
    service = {
      name: 'myapp',
      start: "node app.js &",
      stop: ":kill"
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
        rimraf.sync(path.join(root, 'var', 'svc', 'manifest', 'site', 'autostart.xml'));
        rimraf(path.join(root, 'opt'), next);
      }
    });

    it('should install autostart manifest', function () {
      var manifest = fs.readFileSync(path.join(root, 'var', 'svc', 'manifest', 'site', 'autostart.xml'), 'utf8');
      assert.equal(autostartManifest, manifest);
    });

    it('should install autostart script', function () {
      var script = fs.readFileSync(path.join(root, 'opt', 'local', 'bin', 'autostart.sh'), 'utf8');
      assert.equal(autostartScript, script);
    });

  });

  describe('#service()', function () {
    it('should exist', function () {
      should.exist(sunos.service);
    });

    before(function (next) {
      sunos.service(service, function (err) {
        assert.ok(!err);
        next();
      });
    });

    after(function (next) {
      if (root != '/') {
        rimraf.sync(path.join(root, 'var', 'svc', 'manifest', 'application', service.name + '.xml'));
        rimraf(path.join(root, 'opt'), next);
      }
    });

    it('should install service manifest', function () {
      var manifest = fs.readFileSync(path.join(root, 'var', 'svc', 'manifest', 'application', service.name + '.xml'), 'utf8');
      assert.equal(serviceManifest, manifest);
    });
  });
});
