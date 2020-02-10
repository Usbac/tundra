/**
 * The cache status.
 * @type {bool}
 */
let active = true;

/**
 * The cache views.
 * @type {Object}
 */
let cache = {};


module.exports = class Cache {


    /**
     * Returns a cache view rendered.
     * @param {string} key - The cache key.
     * @param {Object} [data] - The content used for the view.
     * @returns {string} A cache view rendered.
     */
    get(key, data = {}) {
        if (!cache.hasOwnProperty(key)) {
            return false;
        }

        try {
            require('./stdlib.js');
            return new Function(cache[key]).apply(data);
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
        if (!cache.hasOwnProperty(key)) {
            cache[key] = content;
        }
    }


    /**
     * Returns true if the given cache exists, false otherwise.
     * @param {string} key - The cache key.
     * @returns {bool} True if the given cache exists, false otherwise.
     */
    exists(key) {
        return cache.hasOwnProperty(key);
    }


    /**
     * Sets the cache status.
     * True for enabling it, false for disabling it
     * @param {bool} status - The cache status.
     */
    setActive(status) {
        active = status;
    }


    /**
     * Returns true if the cache is active, false otherwise.
     * @returns {bool} True if the cache is active, false otherwise.
     */
    isActive() {
        return active;
    }

}
