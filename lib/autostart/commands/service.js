var autostart = require('../../autostart'),
    errs      = require('errs'),
    os        = require('os'),
    platform  = autostart.argv.platform || os.platform();

var service = exports;

service.usage = [
  'Install a init.d or SMF service',
  '',
  ' autostart service install',
  '',
  'Parameters:',
  '--platform - default (' + os.platform().bold + ')',
  '--start',
  '--stop'
];

service.install = function (callback) {
  var addon;

  var name  = autostart.argv.name,
      start = autostart.argv.start,
      stop  = autostart.argv.stop;

  if (typeof callback != 'function') {
    return autostart.showError(errs.create({ name: 'Arguments', message: 'Bad arguments, please check your command' }));
  }

  try {
    addon = require('../' + platform);
  } catch (err) {
  }

  if (!addon) {
    return callback(errs.create({ name: 'Platform', message: 'No platform found (' + platform.bold + ')', platform: platform }));
  }

  if (!name) {
    return callback(errs.create({ name: 'Arguments', message: "--name required" }));
  }

  if (!start) {
    return callback(errs.create({ name: 'Arguments', message: "--start required" }));
  }

  //
  // Override root folder
  //
  if (autostart.argv.root) {
    autostart.config.set('root', autostart.argv.root);
  }

  var service = {
    name: name,
    start: start,
    stop: stop
  };

  addon.service(service, function (err) {
    if (err) {
      return callback(errs.merge(err));
    }

    autostart.log.info('Creating autostart service');
    autostart.inspect.putObject({ service: service });

    callback();
  });
}
