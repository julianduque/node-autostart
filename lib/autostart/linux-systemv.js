var autostart = require('../autostart'),
    path      = require('path'),
    fs        = require('fs');


var linux = exports;

linux.autostart = function (command, callback) {
  callback(new Error('Not implemented'));
};

linux.service = function (service, callback) {
  callback(new Error('Not implemented'));
};
