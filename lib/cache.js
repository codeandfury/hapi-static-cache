/**
 *
 */
(function() {
  'use strict';

  var
    actual_cache = {},
    fs           = require('fs');

  module.exports = {
    /**
     * Return whether the cache contains this files path.
     *
     * @param  {String} name to check for.
     * @return {void}
     */
    contains: function(name) {
      return actual_cache.hasOwnProperty(name.toString());
    },

    /**
     * Get an item from the cache.
     *
     * @param  {name} item name to retrieve by.
     * @return {Object}
     */
    get: function(name) {
      return actual_cache[name.toString()];
    },

    /**
     * Set the key with contents of a file.
     *
     * @param {String} name  to store under.
     * @param {String} value to store.
     */
    set: function(name, value) {
      actual_cache[name.toString()] = {
        value: value,
        added: Date.now()
      };

      return this;
    },

    /**
     * Return a boolean as to whether this is being read or not.
     *
     * @param  {String}  name to check.
     * @return {Boolean}
     */
    isNotReadingFile: function(name) {
      return actual_cache[name].isReading;
    },

    /**
     * Start reading a file and notify listeners.
     *
     * @param  {String} name to read and cache under
     * @param  {Function} callback to execute once read has finished.
     * @return {void}
     */
    startReadingFile: function(name, callback) {
      if (actual_cache.hasOwnProperty(name)) {
        return actual_cache[name.toString()];
      } else {
        actual_cache[name.toString()] = {};
      }

      var item = actual_cache[name.toString()];

      item.isReading = true;

      fs.readFile(name, function(errors, contents) {
        this.set(name, contents);

        item.queue.forEach(function(listener) {
          listener(errors, item.contents);
        });
      });
    },

    /**
     * Wait for a file to be read anf execute listeners.
     * @param  {[type]} name     [description]
     * @param  {[type]} listener [description]
     * @return {[type]}          [description]
     */
    waitForFileReadToFinish: function(name, listener) {
      actual_cache[name.toString()].listeners.push(listener);
      return this;
    }
  };
})();