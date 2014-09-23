/**
 *
 */
(function() {
  'use strict';

  var
    actual_cache = {},
    file_types   = require('./file-types'),
    path         = require('path'),
    fs           = require('fs');

  module.exports = {
    /**
     * Return whether the cache contains this files path.
     *
     * @param  {String} name to check for.
     * @return {Boolean}
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
     * @return {hapi-static-cache}
     */
    set: function(name, value) {
      var ext = path.extname(name);

      // Set all the values.
      actual_cache[name.toString()] = {
        value: value,
        added: Date.now(),
        headers: [{
          type: 'Content-Type',
          value: file_types[ext.substring(1, ext.length)]
        }],
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
        // Set default properties.
        actual_cache[name.toString()] = {
          listeners: [callback],
          isReading: true
        };
      }

      // Start reading the file.
      fs.readFile(name, function(errors, contents) {
        // Throw any errors.
        if (errors) {
          throw errors;
        }

        // Set the cache object.
        this.set(name, contents);

        // Execute the listeners for this file.
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
      // Get the item.
      var item = this.get(name);

      // Check if we actually got it.
      if (!item) {
        throw new Error('No item for key ' + name);
      }

      // Execute all listeners.
      item.listeners.forEach(function(listener) {
        listener(item);
      });
    },

    /**
     * Wait for a file to be read anf execute listeners.
     * @param  {String} name to wait for.
     * @param  {Function} listener to add to the queue.
     * @return {hapi-static-cache}
     */
    waitForFileReadToFinish: function(name, listener) {
      // Check if it exists or not.
      if (!this.get(name)) {
        actual_cache[name.toString()] = {};
      }

      // Create a listener.
      this.get(name).listeners.push(listener);

      // return
      return this;
    }
  };
})();