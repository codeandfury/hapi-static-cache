/**
 *
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
  module.exports.getFile = function getFile(request, reply) {

    var
      // Get the cache.
      cache = require('./cache');

      // Store in a variable
      var item = request.url.path;

      // If we've already cached it, return it from cache.
      if (cache.contains(item)) {
        // And send it forwards.
        reply(cache.get(item))
      } else {
        // If the cache tells us we're not already reading the file
        // tell it to expect a reading of this file and register a callback.
        if (cache.isNotReadingFile(item)) {
          // Mark as being read.
          cache.startReadingFile(item, reply);
        } else {
          // Otherwise, wait for this read to finish and subscribe this callback.
          cache.waitForFileReadToFinish(item, reply);
        }
      }
  };
})();