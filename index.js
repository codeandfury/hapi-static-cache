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
        var util = require('util');

        // Default options.resources to /static
        options.resources = options.resources || '/static';

        // Create a listener for static files.
        plugin.route({
            method: 'GET',
            path: util.format('%s/{static_request*}', options.resources),
            handler: function(request, reply) {
                var urlPath = request.url.path;
                if (options.publicPath) {
                    urlPath = urlPath.replace(options.resources, options.publicPath);
                }
                // Fetch a file.
                files.getFile(urlPath, function(file) {
                    // Start the response
                    var respond = reply(file.value);

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