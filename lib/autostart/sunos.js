var autostart  = require('../autostart');
    Handlebars = require('handlebars'),
    mkdirp     = require('mkdirp'),
    async      = require('async'),
    errs       = require('errs'),
    path       = require('path'),
    fs         = require('fs');

var sunos = exports;

sunos.autostart = function (command, callback) {
  var root = autostart.config.get('root');
  var files = autostart.config.get('files');

  async.series([
    // Create /opt/local/bin folder
    function (next) {
      mkdirp(path.join(root, 'opt', 'local', 'bin'), function (err) {
        return err ? next(err) : next();
      });
    },
    // Create autostart.xml file
    function (next) {
      var read = fs.createReadStream(path.join(files, 'sunos', 'autostart.xml'));

      read.on('error', function (err) {
        return next(err);
      });

      var write = fs.createWriteStream(path.join(root, 'var', 'svc', 'manifest', 'site', 'autostart.xml'));
      write.on('error', function (err) {
        return next(err);
      });

      write.on('close', function () {
        return next();
      });

      read.pipe(write);
    },
    // Create autostart.sh file
    function (next) {
      fs.readFile(path.join(files, 'sunos', 'autostart.sh'), 'utf8', function (err, script) {
        if (err) {
          return next(err);
        }

        var template = Handlebars.compile(script, { noEscape: true });
        var result = template({ command: command });

        fs.writeFile(path.join(root, 'opt', 'local', 'bin', 'autostart.sh'), result, { mode: 0755 }, function (err) {
          return err ? next(err) : next();
        });
      });
    }
  ], function (err) {
    return err ? callback(errs.merge(err)) : callback();
  });

};

sunos.service = function (service, callback) {
  var root = autostart.config.get('root');
  var files = autostart.config.get('files');

  async.series([
    // Create service.xml file
    function (next) {
      fs.readFile(path.join(files, 'sunos', 'service.xml'), 'utf8', function (err, script) {
        if (err) {
          return next(err);
        }

        var template = Handlebars.compile(script);
        var result = template(service);

        fs.writeFile(path.join(root, 'var', 'svc', 'manifest', 'application', service.name + '.xml'), result, { mode: 0644 }, function (err) {
          return err ? next(err) : next();
        });
      });
    }
  ], function (err) {
    return err ? callback(errs.merge(err)) : callback();
  });
};
