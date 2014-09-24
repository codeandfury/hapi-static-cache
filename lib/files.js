/**
 * A wrapper for cache logic.
 *
 * @version 0.0.1
 * @since   0.0.1
 * @author  davemackintosh
 */
(function() {
    'use strict';

    /**
     * Proxy file system requests through our cache.
     *
     * @param  {String}   path to the file to read out.
     * @param  {Object}   options to pass to `fs.readFile(file, options, callback)`
     * @param  {Function} then
     * @return {void}
     */
    module.exports.getFile = function getFile(urlPath, callback) {

        var
            // Get the cache.
            cache = require('./cache'),

            path = require('path'),

            // Store in a variable
            item = path.resolve('.' + urlPath);

        // If we've already cached it, return it from cache.
        if (cache.contains(item)) {
            // And send it forwards.
            callback(cache.get(item));
        } else {
            // If the cache tells us we're not already reading the file
            // tell it to expect a reading of this file and register a callback.
            if (cache.isNotReadingFile(item)) {
                // Start reading the file.
                cache.startReadingFile(item, callback);
            } else {
                // Otherwise, wait for this read to finish and subscribe this callback.
                cache.waitForFileReadToFinish(item, callback);
            }
        }
    };
})();