/**
 * Plugin registration and routing.
 *
 * @version 0.0.1
 * @since   0.0.1
 * @author  davemackintosh
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
      handler: function(request, reply) {
        // Fetch a file.
        files.getFile(request, function(file) {
          // Start the response
          var respond = reply(file.value.toString());

          // Add headers
          if (file.headers) {
            file.headers.forEach(function(header) {
              respond.header(header.type, header.value);
            });
          }
        });
      }
    });

    // Continue.
    next();
  };

  // Set the attributes for this plugin.
  module.exports.register.attributes = {
    pkg: require('./package.json')
  };

})();