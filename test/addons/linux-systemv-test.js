//
// Linux Addon Test
//
var autostart = require('../../lib/autostart'),
    should    = require('chai').should(),
    assert    = require('chai').assert,
    rimraf    = require('rimraf'),
    path      = require('path'),
    fs        = require('fs'),
    linux     = require('../../lib/autostart/linux-systemv.js');

//
// Change Root
//
autostart.config.set('root', path.join(__dirname, '..', 'root'));

describe('Linux Addon', function () {
  describe('#autostart()', function () {
    it('should exist', function () {
      should.exist(linux.autostart);
    });
  });

  describe('#service()', function () {
    it('should exist', function () {
      should.exist(linux.service);
    });
  });
});
