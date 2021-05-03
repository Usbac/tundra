const Parser = require('./parser.js');
const parser = new Parser();

module.exports = class View {

    /**
     * @constructs
     * @param {Object} [options] - The default options used for the views.
     * The valid options keys are: 'encoding', 'base' and 'scoping'.
     */
    constructor(options = {}) {
        if (options.hasOwnProperty('encoding')) {
            this.setEncoding(options.encoding);
        }

        if (options.hasOwnProperty('base')) {
            parser.setBase(options.base);
        }

        if (options.hasOwnProperty('scoping')) {
            parser.setScoping(Boolean(options.scoping));
        }
    }


    /**
     * Returns the content of a rendered view.
     * @param {string} content - The template content.
     * @param {Object} [data] - The data used for the view.
     * @returns {string} The content of a rendered view.
     */
    getRender(content, data = {}) {
        try {
            require('./stdlib.js');
            return new Function(parser.get(content)).apply(data);
        } catch(err) {
            throw new Error(err);
        }
    }


    /**
     * Renders the given view file.
     * @param {ServerResponse} res - The connection response.
     * @param {string} content - The template content.
     * @param {Object} [data] - The data used for the view.
     */
    render(res, content, data = {}) {
        res.write(this.getRender(content, data));
    }


    /**
     * Sets the value of a regex tag.
     * The available key options are: 'code', 'print', 'print_plain' and 'raw'.
     * Example: set('print', '{$', '$}')
     * @param {string} key - The regex tag to modify.
     * @param {string} first_val - The first (left) value of the tag.
     * @param {string} [last_val] - The last (right) value of the tag.
     * @returns {bool} True in case of success, false otherwise.
     */
    set(key, first_val, last_val = '') {
        return parser.set(key, first_val, last_val);
    }


    /**
     * Adds a custom rule to the parser. The parameter
     * must be a closure that accepts and returns a string.
     * @param {function} func - The custom function.
     */
    extend(func) {
        parser.extend(func);
    }

}
