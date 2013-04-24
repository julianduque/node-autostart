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
  '--command'
];

command.install = function (callback) {
  var addon;
  var command = autostart.argv.command;

  if (typeof callback != 'function') {
    return autostart.showError(errs.create({ name: 'Arguments', message: 'Bad arguments, please check your command' }));
  }

  try {
    addon = require('../' + platform);
  } catch (err) {
  }

  if (!addon) {
    return callback(errs.create({ name: 'Platform', message: 'No platform found', platform: platform }));
  }

  if (!command) {
    return callback(errs.create({ name: 'Arguments', message: "--command required" }));
  }

  addon.autostart(command, function (err) {
    if (err) {
      return callback(errs.merge(err));
    }

    autostart.log.info('Creating autostart command');
    autostart.log.putObject({ command: command });

    callback();
  });
}
