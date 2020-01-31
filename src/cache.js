const fs = require('fs');
const path = require('path');

/**
 * The cache directory.
 * @type {string}
 */
let cache_dir = "";


/**
 * Makes the given cache directory if it does not exists yet.
 * @param {string} dir - The cache file directory.
 */
function mkDir(dir) {
    try {
        if (!fs.statSync(dir).isDirectory()) {
            fs.mkdirSync(dir, {recursive: true});
        }
    } catch(err) {
        fs.mkdirSync(dir, {recursive: true});
    }
}


/**
 * Returns true if the given file cache exists, false otherwise.
 * @param {string} dir - The file directory.
 * @returns {string} True if the given file cache exists, false otherwise.
 */
function exists(dir) {
    try {
        if (fs.statSync(dir).isFile()) {
            return true;
        }
    } catch(err) {
        return false;
    }

    return false;
}


module.exports = class Cache {

    /**
     * Returns the content of a cache file.
     * @param {string} dir - The file path.
     * @param {string} encoding - The encoding used for the file.
     * @returns {string} The content of a cache file.
     */
    get(dir, encoding) {
        dir = path.join(cache_dir, dir);
        let content = false;

        if (exists(dir)) {
            try {
                content = fs.readFileSync(dir, encoding);
            } catch(err) {
                throw new Error(err);
            }
        }

        return content;
    }


    /**
     * Returns a cache view rendered.
     * @param {string} dir - The file path.
     * @param {Object} [data] - The content used for the view.
     * @param {string} encoding - The encoding used for the file.
     * @returns {string} A cache view rendered.
     */
    getRender(dir, data = {}, encoding) {
        let func = this.get(dir, encoding),
            content = "";

        if (func === false) {
            return false;
        }

        try {
            require('./stdlib.js');
            content = new Function(func).apply(data);
        } catch(err) {
            throw new Error(err);
        }

        return content;
    }


    /**
     * Creates a cache file only if it doesn't exists yet.
     * @param {string} dir - The cache file directory.
     * @param {string} content - The content to copy to the file.
     */
    write(dir, content) {
        dir = path.join(cache_dir, dir);

        if (exists(dir)) {
            return;
        }

        mkDir(path.dirname(dir));

        fs.writeFileSync(dir, content, err => {
            if (err && err.code !== 'EEXIST') {
                throw new Error(`Error creating the '${dir}' cache file (${err})`);
            }
        });
    }


    /**
     * Returns true if the given file cache exists, false otherwise.
     * @param {string} dir - The file directory.
     * @returns {string} True if the given file cache exists, false otherwise.
     */
    exists(dir) {
        return exists(path.join(cache_dir, dir));
    }


    /**
     * Sets the cache directory used for the views.
     * @param {string} dir - The new cache directory.
     */
    setDir(dir) {
        cache_dir = dir;
    }


    /**
     * Returns the cache directory used for the views.
     * @returns {string} The cache directory.
     */
    getDir() {
        return cache_dir;
    }


    /**
     * Returns true if the cache is active, false otherwise.
     * @returns {string} True if the cache is active, false otherwise.
     */
    isActive() {
        return cache_dir.length > 0;
    }

}
