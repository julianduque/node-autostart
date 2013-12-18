var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    autostart = require('../autostart'),
    Handlebars = require('handlebars');

var upstart = exports;

upstart.service = function (service, callback) {
  var root = autostart.config.get('root'),
      files = autostart.config.get('files');

  fs.readFile(path.join(files, 'upstart', 'service.conf'), 'utf8', function (err, script) {
    if (err) {
      return callback(err);
    }

    var template = Handlebars.compile(script);
    var result = template(service);

    fs.writeFile(
      path.join(root, 'etc', 'init', service.name + '.conf'),
      result,
      { mode: 0644 },
      callback
    );
  });
};
