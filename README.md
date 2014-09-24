hapi-static-cache
=================

Fast memory based static caching plugin for Hapi.

Queues static file reads into single read operations and stores contents in cache for super fast retrieval.

#### Install

```bash
npm install hapi-static-cache
```

#### Usage

The most basic usage is to just use the require method and it will auto register itself and set up your
static directory in `/static/`

```js
server.pack.register(require('hapi-static-cache'), function(error) {
    if (error) {
        throw error;
    }
});
```

If you don't want to base your static content out of `/static/` pass options to the plugin the same as
hapi documents.

```js
server.pack.register({
  plugin: require('hapi-static-cache'),
  options: {
      resources: '/public'
  }
}, function(error) {
    if (error) {
        throw error;
    }
});
```