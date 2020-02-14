/**
 * The cache views.
 * @type {Map}
 */
let cache = new Map();


module.exports = class Cache {

    /**
     * Default constructor initializing the active status.
     */
    constructor() {
        this.active = false;
    }


    /**
     * Returns a cache view rendered.
     * @param {string} key - The cache key.
     * @param {Object} [data] - The content used for the view.
     * @returns {string} A cache view rendered.
     */
    get(key, data = {}) {
        if (!cache.has(key)) {
            return false;
        }

        try {
            require('./stdlib.js');
            return new Function(cache.get(key)).apply(data);
        } catch(err) {
            throw new Error(err);
        }
    }


    /**
     * Save a cache only if it doesn't exists yet.
     * @param {string} key - The cache key.
     * @param {string} content - The cache content.
     */
    set(key, content) {
        if (!cache.has(key)) {
            cache.set(key, content);
        }
    }


    /**
     * Returns true if the given cache exists, false otherwise.
     * @param {string} key - The cache key.
     * @returns {bool} True if the given cache exists, false otherwise.
     */
    has(key) {
        return cache.has(key);
    }

}
