var autostart = require('../../autostart'),
    errs      = require('errs'),
    os        = require('os'),
    platform  = autostart.argv.platform || os.platform();

var command = exports;

command.usage = [
  'Install a rc.local style command',
  '',
  ' autostart command install',
  '',
  'Parameters:',
  '--platform - default (' + os.platform().bold + ')',
  '--exec'
];

command.install = function (callback) {
  var addon;
  var exec = autostart.argv.exec;

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

  if (!exec) {
    return callback(errs.create({ name: 'Arguments', message: "--exec required" }));
  }

  //
  // Override root folder
  //
  if (autostart.argv.root) {
    autostart.config.set('root', autostart.argv.root);
  }

  addon.autostart(exec, function (err) {
    if (err) {
      return callback(errs.merge(err));
    }

    autostart.log.info('Creating autostart command');
    autostart.inspect.putObject({ exec: exec });

    callback();
  });
}
