(function() {
    'use strict';

    var
        // Get assertion library.
        assert = require('assert'),

        // Get the caching function
        cache  = require('../lib/cache'),

        // The test file
        test_file = 'test/hapi.png';

    describe('./lib/cache.js', function() {
        it('Doesn\'t contain test file yet.', function() {
            assert.ok(!cache.contains(test_file), 'Cache somehow contains the test file');
        });

        it('Reads the file into a buffer and fires callback', function(done) {
            cache.startReadingFile(test_file, function(file) {
                assert(file.value instanceof Buffer, 'File value is not a Buffer.');
                done();
            });
            assert.ok(!cache.isNotReadingFile(test_file), 'File not marked as being read.');
        });
    });
})();