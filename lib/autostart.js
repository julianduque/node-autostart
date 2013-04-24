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
      autostart.log.error(err);
      autostart.log.error('autostart'.grey + ' not ok'.red);
      return callback(err);
    }

    autostart.welcome();

    return autostart.exec(autostart.argv._, callback);
  });
}

autostart.exec = function (command, callback) {
  autostart.log.info('Executing command ' + command.join(' ').magenta);

  autostart.router.dispatch('on', command.join(' '), autostart.log, function (err, shallow) {
    if (err) {
      autostart.log.error(err);
      return callback(err);
    }

    callback();
  });
};
