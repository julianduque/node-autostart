var handlebars = require('handlebars'),
    fs         = require('fs');

var autostart = exports;

//
// _loadTemplate: Loads os template
//
function _loadTemplate(os, cb) {
  cb(null);
}

autostart._loadTemplate = _loadTemplate;

autostart.create = function create(os, command, cb) {
  //
  // Load Template
  //
  _loadTemplate(os, function (err, template) {
    if (err) {
      return cb(err);
    }

    cb();
  });
};
