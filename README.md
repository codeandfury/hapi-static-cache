hapi-static-cache
=================

Fast memory based static caching plugin for Hapi.

Queues static file reads into single read operations and stores contents in cache for super fast retrieval.

#### Install

    npm install hapi-static-cache

#### Usage

    server.pack.register(require('hapi-static-cache'), function(error) {
        if (error) {
            throw error;
        }
    });