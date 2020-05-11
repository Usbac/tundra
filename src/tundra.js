const path = require('path');
const Cache = require('./cache.js');
const cache = new Cache();
const Parser = require('./parser.js');
const parser = new Parser();

const ERROR_PREFIX = 'Error:';
const ERROR_INDEX = `${ERROR_PREFIX} Undefined index`;

/**
 * The file views extension.
 * @type {string}
 */
let extension = '';

/**
 * The base directory for the views.
 * @type {string}
 */
let base_dir = '';


/**
 * Returns a view rendered.
 * @param {string} dir - The file path.
 * @param {Object} [data] - The content used for the view.
 * @returns {string} A view rendered.
 */
function getRender(dir, data = {}) {
    let func = parser.get(dir);
    let content = '';

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


module.exports = class View {

    /**
     * @constructs
     * @param {Object} [options] - The default options used for the views.
     * The valid options keys are: 'cache', 'encoding' and 'extesion'.
     */
    constructor(options = {}) {
        this.setOptions(options);
    }


    /**
     * Set the options.
     * @param {Object} options - The default options used for the views.
     * The valid options keys are: 'cache', 'encoding', 'base', 'extesion' and 'scoping'.
     */
    setOptions(options) {
        if (options.hasOwnProperty('cache')) {
            cache.active = options.cache;
        }

        if (options.hasOwnProperty('encoding')) {
            this.setEncoding(options.encoding);
        }

        if (options.hasOwnProperty('base')) {
            this.setBase(options.base);
        }

        if (options.hasOwnProperty('extension')) {
            this.setExtension(options.extension);
        }

        if (options.hasOwnProperty('scoping')) {
            parser.setScoping(Boolean(options.scoping));
        }
    }


    /**
     * Map some of the general methods into the response.
     * @param {ServerResponse} res - The connection response.
     * @param {Object} [config] - The default options used for the views.
     */
    mapResponse(res) {
        res.render = (dir, data) => {
            return this.render(res, dir, data);
        };

        res.getRender = (dir, data) => {
            return this.getRender(dir, data);
        };

        res.exists = (dir) => {
            return this.exists(dir);
        };
    }


    /**
     * Returns the content of a rendered view.
     * @param {string} dir - The file path.
     * @param {Object} [data] - The content used for the view.
     * @returns {string} The content of a rendered view.
     */
    getRender(dir, data = {}) {
        if (extension.length > 0) {
            dir = `${dir}.${extension}`;
        }

        let complete_dir = path.join(base_dir, dir);

        //Without cache
        if (!cache.active) {
            if (!parser.exists(complete_dir)) {
                console.log(`${ERROR_NOT_FOUND} (${complete_dir})`);
                return false;
            }

            return getRender(complete_dir, data);
        }

        //With cache
        if (!cache.has(dir)) {
            if (!parser.exists(complete_dir)) {
                console.log(`${ERROR_NOT_FOUND} (${complete_dir})`);
                return false;
            }

            cache.set(dir, parser.get(complete_dir));
        }

        return cache.get(dir, data);
    }


    /**
     * Renders the given view file.
     * @param {ServerResponse} res - The connection response.
     * @param {string} dir - The file path.
     * @param {Object} [data] - The content used for the view.
     * @returns {bool} True if the view has been rendered, false otherwise.
     */
    render(res, dir, data = {}) {
        let content = this.getRender(dir, data);

        if (content !== false) {
            res.write(content);
            return true;
        }

        return false;
    }


    /**
     * Returns true if the given file exists, false otherwise.
     * @param {string} dir - The file directory.
     * @returns {string} True if the given file exists, false otherwise.
     */
    exists(dir) {
        if (extension.length > 0) {
            dir = `${dir}.${extension}`;
        }

        return parser.exists(path.join(base_dir, dir));
    }


    /**
     * Sets the value of a regex tag.
     * The available key options are: 'code', 'print', 'print_plain' and 'raw'.
     * Example: set('print', '{$', '$}')
     * @param {string} key - The regex tag to modify.
     * @param {string} first_val - The first (left) value of the tag.
     * @param {string} [last_val] - The last (right) value of the tag.
     * @returns {string} True in case of success, false otherwise.
     */
    set(key, first_val, last_val = '') {
        if (typeof general_regex == 'undefined') {
            setRegex();
        }

        switch(key) {
            case 'code':
                lookaround_regexs.code = new RegExp(`${regex_not_raw}(?=${first_val})(.*?)(?<=${last_val})`);
                lookaround_regexs.code_begin = new RegExp(`${regex_not_raw}(?=${first_val})(.*)(?<=:( ?){1,}${last_val})`);
                lookaround_regexs.code_end = new RegExp(`${regex_not_raw}(?=${first_val})( ?){1,}end( ?){1,}(?<=${last_val})`);
                break;
            case 'print_plain': case 'print':
                lookaround_regexs[key] = new RegExp(`${regex_not_raw}(?=${first_val})(.*?)(?<=${last_val})`);
                break;
            case 'comment':
                lookaround_regexs[key] = new RegExp(`${regex_not_raw}(?=${first_val})([\\s\\S]*?)(?<=${last_val})`);
                break;
            case 'raw':
                regex_raw = first_val;
                regex_not_raw = `(?<!${regex_raw})`;
                break;
            default:
                console.log(`${ERROR_INDEX} '${key}'`);
                return false;
        }

        UpdateNormalRegex();
        updateGeneralRegex();
        return true;
    }


    /**
     * Sets the file encoding used for the views.
     * @param {string} [encoding] - The file encoding.
     */
    setEncoding(encoding = undefined) {
        parser.setEncoding(encoding);
    }


    /**
     * Returns the file encoding used for the views.
     * @returns {string} The file encoding.
     */
    getEncoding() {
        return parser.getEncoding();
    }


    /**
     * Sets the base directory for the views.
     * @param {string} [dir] - The new base directory.
     */
    setBase(dir = '') {
        base_dir = dir;
    }


    /**
     * Returns the base directory for the views.
     * @returns {string} The base directory.
     */
    getBase() {
        return base_dir;
    }


    /**
     * Sets the file extension used for the views.
     * @param {string} [new_extension] - The new file extension.
     */
    setExtension(new_extension = '') {
        extension = new_extension;
    }


    /**
     * Returns the file extension used for the views.
     * @returns {string} The file extension.
     */
    getExtension() {
        return extension;
    }

}
