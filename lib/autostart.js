var flatiron = require('flatiron'),
    package  = require('../package'),
    colors   = require('colors'),
    path     = require('path'),
    app      = flatiron.app;


var autostart = module.exports = new flatiron.App({
  root: path.join(__dirname, '..')
});

autostart.use(flatiron.plugins.cli, {
  usage: [
    'Usage'.cyan.bold.underline,
    '',
    ' autostart <command> <params>',
    '',
    'Commands:'.cyan.bold.underline,
    '',
    ' autostart command - Create a rc.local like autostart command',
    ' autostart service - Create a init.d or SMF service',
    ''
  ],
  source: path.join(__dirname, 'autostart', 'commands'),
  argv: {}
});

autostart.options.log = {
  console: { raw: autostart.argv.raw }
};

//
// Default config
//
autostart.config.set('root', '/');
autostart.config.set('files', path.join(__dirname, '..', 'files'));

//
// Welcome
//
autostart.welcome = function () {
  autostart.log.info('Welcome to '+ 'autostart'.grey + ' ' + package.version.magenta);
  autostart.log.info('It worked if it ends with ' + 'autostart'.grey + ' ok'.green.bold);
}

autostart.start = function (callback) {
  (typeof autostart.argv.colors === 'undefined' || autostart.argv.colors) || (colors.mode = 'none');

  autostart.init(function (err) {
    if (err) {
      autostart.welcome();
      autostart.showError(err);
      return callback(err);
    }

    autostart.welcome();

    return autostart.exec(autostart.argv._, callback);
  });
}

autostart.exec = function (command, callback) {

  if (command.length > 0) {
    autostart.log.info('Executing command ' + command.join(' ').magenta);
  }

  //
  // Default install action
  //
  if (command[0] === 'command' || command[0] === 'service') {
    command[1] = 'install';
  }

  autostart.router.dispatch('on', command, autostart.log, function (err, shallow) {
    if (err) {
      autostart.showError(err);
      return callback(err);
    }

    callback();
  });
};

autostart.showError = function (error) {

  switch (error.name) {
    case 'Error':
        if (error.code === 'EACCES') {
          autostart.log.warn('This command needs to be executed by ' + 'root'.bold);
        }
      break;

    default:
      autostart.log.error(error);
  }

  autostart.log.error('autostart'.grey + ' not ok'.red);
};
