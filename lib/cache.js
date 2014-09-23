/**
 *
 */
(function() {
  'use strict';

  var
    actual_cache = {},
    path         = require('path'),
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
        added: Date.now(),
        listeners: actual_cache[name.toString()].listeners
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
      // Get the item.
      var item = this.get(name);

      // Check if it exists.
      if (!item) {
        return true;
      } else {
        return !item.isReading;
      }
    },

    /**
     * Start reading a file and notify listeners.
     *
     * @param  {String} name to read and cache under
     * @param  {Function} callback to execute once read has finished.
     * @return {void}
     */
    startReadingFile: function(name, callback) {
      // If we get it, fire listeners.
      if (this.get(name)) {
        return this.get(name);
      } else {
        actual_cache[name.toString()] = {
          listeners: [callback],
          isReading: true
        };
      }

      fs.readFile(name, function(errors, contents) {
        if (errors) {
          throw errors;
        }

        this.set(name, contents);

        this.executeListenersForFile(name);
      }.bind(this));
    },

    /**
     * Execute the listeners for the named cache item.
     *
     * @param  {String} name of cache item to fulfill.
     * @return {void}
     */
    executeListenersForFile: function(name) {
      var item = this.get(name);

      if (!item) {
        throw new Error('No item for key ' + name);
      }

      item.listeners.forEach(function(listener) {
        console.log(item);
        listener(item.contents);
      });
    },

    /**
     * Wait for a file to be read anf execute listeners.
     * @param  {[type]} name     [description]
     * @param  {[type]} listener [description]
     * @return {[type]}          [description]
     */
    waitForFileReadToFinish: function(name, listener) {
      if (!actual_cache[name.toString()]) {
        actual_cache[name.toString()] = {};
      }
      actual_cache[name.toString()].listeners.push(listener);
      return this;
    }
  };
})();