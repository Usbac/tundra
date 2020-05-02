const fs = require('fs');
const path = require('path');
const Cache = require('./cache.js');
const cache = new Cache();

const DEFAULT_ENCODING = 'UTF-8';
const ARRAY = `tundra_${getToken()}`;
const ERROR_PREFIX = 'Error:';
const ERROR_NOT_FOUND = `${ERROR_PREFIX} File not found`;
const ERROR_INDEX = `${ERROR_PREFIX} Undefined index`;
const ERROR_BLOCK = `${ERROR_PREFIX} No parent block found with the name`;
const ERROR_SPREAD = `${ERROR_PREFIX} No spread block found with the name`;

/**
 * The raw regex used to escape the rest of the tags.
 * @type {string}
 */
let regex_raw;

/**
 * The negation of the raw regex.
 * @type {string}
 */
let regex_not_raw;

/**
 * List of the existing regexs.
 * @type {Object}
 */
let regexs;

/**
 * List of the existing regexs with lookarounds.
 * @type {Object}
 */
let lookaround_regexs;

/**
 * The general regex which matches most  of the existing regexs.
 * This is used to split the view content and iterate and replace
 * over its matches.
 * @type {RegExp}
 */
let general_regex;

/**
 * The encoding for files.
 * @type {string}
 */
let encoding = DEFAULT_ENCODING;

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
 * Use or not the scoping in the views.
 * @type {bool}
 */
let scoping = false;


/**
 * Returns a random alphanumeric string.
 * @returns {string} The random alphanumeric string.
 */
function getToken() {
    return Math.random().toString(36).slice(2);
}


/**
 * Initializes all the regex variables.
 */
function setRegex() {
    regexs = {};
    regex_raw = '~';
    regex_not_raw = `(?<!${regex_raw})`;

    //Update lookarounds regex
    lookaround_regexs = {
        'block': new RegExp(`${regex_not_raw}(?=\\{\\[)( ?){1,}block( ?){1,}([^\\]\\}]*)( ?){1,}(?<=\\]\\})([\\s\\S]*?)(\\{\\[)( ?){1,}endblock( ?){1,}(\\]\\})`),
        'parent': new RegExp(`${regex_not_raw}(?=\\{\\[)( ?){1,}parent([^\\]\\}]*)(?<=\\]\\})`),
        'spread_block': new RegExp(`${regex_not_raw}(?=\\{\\[)( ?){1,}spread( ?){1,}([^\\]\\}]*)( ?){1,}(?<=\\]\\})([\\s\\S]*?)(\\{\\[)( ?){1,}endspread( ?){1,}(\\]\\})`),
        'extends': new RegExp(`${regex_not_raw}(?=@extends\\()(.*)(?<=\\))`),
        'require': new RegExp(`${regex_not_raw}(?=@require\\()(.*)(?<=\\))`),
        'spread': new RegExp(`${regex_not_raw}(?=@spread\\()(.*)(?<=\\))`),
        'comment': new RegExp(`${regex_not_raw}(?={#)([\\s\\S]*?)(?<=#})`),
        'print_plain': new RegExp(`${regex_not_raw}(?={!)(.*?)(?<=!})`),
        'print': new RegExp(`${regex_not_raw}(?={{)(.*?)(?<=}})`),
        'code': new RegExp(`${regex_not_raw}(?={%)(.*?)(?<=%})`),
        'code_begin': new RegExp(`${regex_not_raw}(?={%)(.*?)(?<=:( ?){1,}%})`),
        'code_end': new RegExp(`${regex_not_raw}(?={%)( ?){1,}end( ?){1,}(?<=%})`)
    }

    UpdateNormalRegex();
    updateGeneralRegex();
}


/**
 * Sets the regexs array values equal to lookaround_regex array values
 * without zero-length assertions (lookarounds).
 */
function UpdateNormalRegex() {
    Object.keys(lookaround_regexs).forEach(key => {
        regexs[key] = noLookarounds(lookaround_regexs[key]);
    });
}


/**
 * Returns a given regex without zero-length assertions
 * (lookarounds).
 * @param {string} regex - The regular expression.
 * @returns {string} The given regex without zero-length assertions.
 */
function noLookarounds(regex) {
    return new RegExp(regex.source.replace(/(\?\=|\?\<\=)/gm, ''));
}


/**
 * Initializes the general regex based on the other
 * existing regex variables.
 */
function updateGeneralRegex() {
    general_regex = new RegExp(
        lookaround_regexs.comment.source + '|' +
        lookaround_regexs.code.source + '|' +
        lookaround_regexs.print.source + '|' +
        lookaround_regexs.print_plain.source, 'gm');
}


/**
 * Returns the function partial source code of the given element.
 * @param {string} element - The element which is a partial string of the original file.
 * @returns {string} The function partial source code of the given element.
 */
function getCode(element) {
    //Comment
    if (regexs.comment.test(element)) {
        return '';
    }

    //Begin code block
    if (regexs.code_begin.test(element)) {
        return `${element.replace(regexs.code_begin, '$2 {')}`;
    }

    //End code block
    if (regexs.code_end.test(element)) {
        return '}';
    }

    //Code
    if (regexs.code.test(element)) {
        return `${element.replace(regexs.code, '$2')}`;
    }

    //Print
    if (regexs.print.test(element)) {
        return `${ARRAY}.push(escape(${element.replace(regexs.print, '$2')}));`;
    }

    //Print plain
    if (regexs.print_plain.test(element)) {
        return `${ARRAY}.push(${element.replace(regexs.print_plain, '$2')});`;
    }

    //Text
    return `${ARRAY}.push(\`${element}\`);`;
}


/**
 * Returns a view rendered.
 * @param {string} dir - The file path.
 * @param {Object} [data] - The content used for the view.
 * @returns {string} A view rendered.
 */
function getRender(dir, data = {}) {
    let func = getSourceCode(dir);
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


/**
 * Returns the generated function source code of the given view file.
 * @param {string} dir - The file path.
 * @returns {string} The generated function source code of the given view file.
 */
function getSourceCode(dir) {
    if (!exists(dir)) {
        return false;
    }

    let content = fs.readFileSync(dir, encoding);
    let func = scoping ? '' : 'with (this)';
    func += `{ let ${ARRAY} = [];`;

    content = replaceSpreads(content);
    content = replaceExtends(content);
    content = replaceRequire(content);

    if (typeof content === 'string') {
        content.split(general_regex).filter(e => e).forEach(e => {
            func += getCode(e) + ';';
        });
    }

    func = removeRaw(func);
    func += `return ${ARRAY}.join(''); }`;

    return func;
}


/**
 * Returns the content of a view with the spread blocks replaced,
 * and without the spread blocks definition.
 * @param {string} content - The child view content.
 * @returns {string} The content of the view with the spread blocks replaced.
 */
function replaceSpreads(content) {
    let regex_spread = new RegExp(regexs.spread.source, 'g');
    let regex_spread_block = new RegExp(regexs.spread_block.source, 'g');
    content = content.replace(regex_spread, e => {
        let name = e.replace(regex_spread, '$2').trim();
        return getSpread(content, name);
    });

    // Remove remaining spread blocks
    return content.replace(regex_spread_block, '');
}


/**
 * Returns the given content with the specified spread block replaced.
 * @param {string} content - The child view content.
 * @param {string} name - The name of the spread block to replace.
 * @returns {string} The content with the specified spread block replaced.
 */
function getSpread(content, name) {
    let regex_spread = new RegExp(regexs.spread_block.source.replace('([^\\]\\}]*)', name), 'g');
    let spread_content;

    if ((spread_content = regex_spread.exec(content)) != null) {
        return spread_content[6].trim();
    }

    console.log(`${ERROR_SPREAD} '${name}'`);
    return '';
}


/**
 * Returns the given content replaced by its parent content
 * @param {string} content - The child view content.
 * @returns {string} The content replaced by its parent content.
 */
function replaceExtends(content) {
    if (!regexs.extends.test(content)) {
        return content;
    }

    let parent_dir = regexs.extends.exec(content)[2];
    content = getInheritCode(parent_dir, content);
    if (!content) {
        console.log(`${ERROR_NOT_FOUND} (${parent_dir})`);
    }

    return content;
}


/**
 * Returns the given content with the require tags replaced
 * by the content of the file they specified.
 * @param {string} content - The view content.
 * @returns {string} The content with the require tags replaced
 * by the content of the file they specified.
 */
function replaceRequire(content) {
    let regex_require = new RegExp(regexs.require.source, 'g');
    content = content.replace(regex_require, e => {
        let file_path = e.replace(regexs.require, '$2').trim();

        if (!exists(file_path)) {
            console.log(`${ERROR_NOT_FOUND} (${file_path})`);
            return '';
        }

        return fs.readFileSync(file_path, { encoding: encoding });
    });

    return content;
}


/**
 * Returns the processed code of a child view
 * based on its parent.
 * @param {string} parent_dir - The parent file path.
 * @param {string} content - The child view content.
 */
function getInheritCode(parent_dir, content) {
    if (!exists(parent_dir)) {
        return false;
    }

    let parent_content = fs.readFileSync(parent_dir, encoding);

    //Replace parent blocks tags with their respective code in the child view
    let parent_regex = new RegExp(regexs.parent.source, 'gm');

    content = content.replace(parent_regex, e => {
        let block_name = e.replace(parent_regex, '$3').trim();
        return getBlock(parent_content, block_name, true);
    });

    //Replace child blocks import in the parent view
    let block_regex = new RegExp(regexs.block.source, 'gm');

    parent_content = parent_content.replace(block_regex, e => {
        let block_name = e.replace(block_regex, '$4').trim();
        return getBlock(content, block_name);
    });

    return parent_content;
}


/**
 * Returns the code that's inside a block tag.
 * @param {string} content - The string where the block will be searched.
 * @param {string} block_name - The name of the block.
 * @param {bool} log - Log errors or not if the block isn't found.
 * @returns {string} The content inside the block.
 */
function getBlock(content, block_name, log = false) {
    let block_regex = new RegExp(regexs.block.source.replace('([^\\]\\}]*)', block_name));
    let block_content;

    if ((block_content = block_regex.exec(content)) != null) {
        return block_content[6];
    }

    if (log) {
        console.log(`${ERROR_BLOCK} '${block_name}'`);
    }

    return '';
}


/**
 * Returns the given string without the raw tags.
 * @param {string} str - The string.
 * @returns {string} The given string without the raw tags.
 */
function removeRaw(str) {
    Object.keys(lookaround_regexs).forEach(key => {
        let regex = `${regex_raw}(${ lookaround_regexs[key].source.replace(regex_not_raw, '') })`;
        str = str.replace(new RegExp(regex), '$1');
    });

    return str;
}


/**
 * Returns true if the given file exists, false otherwise.
 * @param {string} str - The file directory.
 * @returns {string} True if the given file exists, false otherwise.
 */
function exists(dir) {
    try {
        return fs.lstatSync(dir).isFile();
    } catch(err) {
        return false;
    }
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
            scoping = Boolean(options.scoping);
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
        if (typeof general_regex == 'undefined') {
            setRegex();
        }

        if (extension.length > 0) {
            dir = `${dir}.${extension}`;
        }

        let complete_dir = path.join(base_dir, dir);

        //Without cache
        if (!cache.active) {
            if (!exists(complete_dir)) {
                console.log(`${ERROR_NOT_FOUND} (${complete_dir})`);
                return false;
            }

            return getRender(complete_dir, data);
        }

        //With cache
        if (!cache.has(dir)) {
            if (!exists(complete_dir)) {
                console.log(`${ERROR_NOT_FOUND} (${complete_dir})`);
                return false;
            }

            cache.set(dir, getSourceCode(complete_dir, data));
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

        return exists(path.join(base_dir, dir));
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
     * @param {string} [new_encoding] - The new file encoding.
     */
    setEncoding(new_encoding = DEFAULT_ENCODING) {
        encoding = new_encoding;
    }


    /**
     * Returns the file encoding used for the views.
     * @returns {string} The file encoding.
     */
    getEncoding() {
        return encoding;
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
