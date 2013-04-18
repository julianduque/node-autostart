var autostart = require('../'),
    should    = require('chai').should(),
    assert    = require('chai').assert,
    fs        = require('fs');

describe('SunOS Platform', function () {
  describe('autostart', function () {

    describe('#_loadTemplate', function () {
      it('should exist', function () {
        should.exist(autostart._loadTemplate);
      });

      it('should load a template');
    });

    describe('#create', function () {
      it('should exist', function () {
        should.exist(autostart.create);
      });

      it('should create an autostart install script');
    });
  });
});
