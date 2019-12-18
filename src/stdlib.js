/*
 * Standard library used by tundra,
 * the functions defined here can be called globally
 * in the views rendered by the template.
 */


/**
 * Returns the total sum of the given arguments, all of them are treated as
 * numbers.
 * @param {string} args - The argument list.
 * @returns {string} The sum of all the given arguments.
 */
global.sum = (...args) => 
{
    let result = 0;
    let i;

    for (i = 0; i < args.length; i++) {
        result += parseFloat(args[i]);
    }

    return result;
}


/**
 * Returns the total subtraction of the given arguments, all of them are treated as
 * numbers.
 * @param {string} args - The argument list.
 * @returns {string} The subtraction of all the given arguments.
 */
global.subtract = (...args) => 
{
    let result = 0;
    let i;

    for (i = 0; i < args.length; i++) {
        result -= parseFloat(args[i]);
    }

    return result;
}


/**
 * Returns the given string with the HTML tags escaped.
 * Those are: '&', '"', '<' and '>'.
 * @param {string} str - The string.
 * @returns {string} the given string with the HTML tags escaped.
 * Those are: '&', '"', '<' and '>'.
 */
global.escape = (str) => 
{
    return str.toString().replace(/&/g, '&amp;')
                         .replace(/"/g, '&quot;')
                         .replace(/</g, '&lt;')
                         .replace(/>/g, '&gt;');
}


/**
 * Returns everything before the specified substring.
 * @param {string} str - The main string.
 * @param {string} subtr - The substring used to cut the main.
 * @returns {string} Everything before the specified substring.
 */
global.strBefore = (str, substr) => 
{
    return str.substring(0, str.lastIndexOf(substr));
}


/**
 * Returns everything after the specified substring.
 * @param {string} str - The main string.
 * @param {string} subtr - The substring used to cut the main.
 * @returns {string} Everything after the specified substring.
 */
global.strAfter = (str, substr) => 
{
    return str.substring(str.lastIndexOf(substr) + substr.length);
}


/**
 * Returns the main string with the given substring removed.
 * @param {string} str - The main string.
 * @param {string} subtr - The substring that will be removed.
 * @returns {string} The main string with the given substring removed.
 */
global.remove = (str, substr) =>
{
    return str.replace(new RegExp(substr, 'g'), '');
}


/**
 * Returns a local url.
 * @param {ServerRequest} req - The request.
 * @param {string} route - The route.
 * @returns {string} The local url.
 */
global.url = (req, route) => 
{
    if (route.charAt(0) !== '/') {
        route = '/' + route;
    }

    let protocol = 'http';
    if (typeof req.connection.encrypted !== 'undefined') {
        protocol = 'https';
    }

    return protocol + "://" + req.headers.host + route;
}