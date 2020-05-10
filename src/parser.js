const fs = require('fs');

const ARRAY = `tundra_${getToken()}`;
const ERROR_PREFIX = 'Parser error:';
const ERROR_NOT_FOUND = `${ERROR_PREFIX} File not found`;
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
let encoding;

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


module.exports = class Parser {

    /**
     * Returns the generated code of the given file path.
     * @param {string} dir - The file path.
     * @returns {string} The generated code of the given file path.
     */
    get(dir) {
        if (!exists(dir)) {
            return false;
        }

        if (typeof general_regex == 'undefined') {
            setRegex();
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
     * Returns true if the given file exists, false otherwise.
     * @param {string} str - The file directory.
     * @returns {string} True if the given file exists, false otherwise.
     */
    exists(dir) {
        return exists(dir);
    }


    /**
     * Sets the scoping for the variables.
     * @param {string} [new_scope] - Use or not scoping.
     */
    setScoping(new_scope) {
        scope = new_scope;
    }


    /**
     * Sets the file encoding used for the views.
     * @param {string} [new_encoding] - The new file encoding.
     */
    setEncoding(new_encoding) {
        encoding = new_encoding;
    }


    /**
     * Returns the file encoding used for the views.
     * @returns {string} The file encoding.
     */
    getEncoding() {
        return encoding;
    }
}
