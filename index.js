/**
 *
 */
(function() {
  'use strict';

  module.exports.register = function register_static_cache(plugin, options, next) {
    // Get the files api.
    var files = require('./lib/files');

    // Util functions.
    var util  = require('util');

    // Create a listener for static files.
    plugin.route({
      method: 'GET',
      path: util.format('%s/{static_request*}', options.resources || '/static'),
      handler: files.getFile
    });

    // Continue.
    next();
  };

  module.exports.register.attributes = {
    pkg: require('./package.json')
  };

})();