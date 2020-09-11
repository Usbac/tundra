/*
 * Standard library used by tundra,
 * the functions defined here can be called globally
 * in the views rendered by the template.
 */


/**
 * Returns the total sum of the given arguments, all of them are treated as
 * numbers.
 * @param {*} args - The argument list.
 * @returns {string} The sum of all the given arguments.
 */
sum = (...args) => {
    let result = 0;

    for (let i = 0; i < args.length; i++) {
        result += parseFloat(args[i]);
    }

    return result;
}


/**
 * Returns the total subtraction of the given arguments, all of them are treated as
 * numbers.
 * @param {*} args - The argument list.
 * @returns {string} The subtraction of all the given arguments.
 */
subtract = (...args) => {
    let result = 0;
    let i;

    for (i = 0; i < args.length; i++) {
        result -= parseFloat(args[i]);
    }

    return result;
}


/**
 * Returns the average number of the giving array.
 * @param {array} numbers - The array with the numeric values.
 * @param {Number} [decimals] - The decimal places to round.
 * @returns {Number} The average number of the giving array.
 */
average = (numbers, decimals = 2) => {
    return (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(decimals);
}


/**
 * Returns the given string with the HTML tags escaped.
 * Those are: '&', '"', '<' and '>'.
 * @param {string} str - The string.
 * @returns {string} the given string with the HTML tags escaped.
 */
escape = (str) => {
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
strBefore = (str, substr) => {
    return str.substring(0, str.lastIndexOf(substr));
}


/**
 * Returns everything after the specified substring.
 * @param {string} str - The main string.
 * @param {string} subtr - The substring used to cut the main.
 * @returns {string} Everything after the specified substring.
 */
strAfter = (str, substr) => {
    return str.substring(str.lastIndexOf(substr) + substr.length);
}


/**
 * Returns the main string with the given substring removed.
 * @param {string} str - The main string.
 * @param {string} subtr - The substring that will be removed.
 * @returns {string} The main string with the given substring removed.
 */
remove = (str, substr) => {
    return str.replace(new RegExp(substr, 'g'), '');
}


/**
 * Returns a local url.
 * @param {ServerRequest} req - The request.
 * @param {string} route - The route.
 * @returns {string} The local url.
 */
url = (req, route) => {
    if (route.charAt(0) !== '/') {
        route = '/' + route;
    }

    let protocol =
        typeof req.connection.encrypted !== 'undefined' ?
        'https' :
        'http';

    return protocol + '://' + req.headers.host + route;
}


/**
 * Returns the given string with the whitespaces removed from both sides of it
 * and its first letter uppercase.
 * @param {string} str - The string.
 * @returns {string} The given string with the whitespaces removed from both sides of it
 * and its first letter uppercase.
 */
titleCase = (str) => {
    str = str.trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * Returns the given string with all its words starting with uppercase letters.
 * @param {string} str - The string.
 * @returns {string} The given string with all its words starting with uppercase letters.
 */
capitalize = (str) => {
    let arr = str.split(' ');

    arr.forEach((e, index) => {
        arr[index] = e.charAt(0).toUpperCase() + e.slice(1);
    });

    return arr.join(' ');
}


/**
 * Returns an array containing the numbers from the specified start to the specified end.
 * @param {Number} start - The start number.
 * @param {Number} end - The final number.
 * @param {Number} steps - The increase steps.
 * @returns {array} An array containing the numbers from the specified start to the specified end.
 */
range = (start, end, steps = 1) => {
    if (start > end) {
        return [];
    }

    let arr = [ start ];
    let i = start;

    while(true) {
        i += steps;

        if (i <= end) {
            arr.push(i);
        } else {
            break;
        }
    }

    return arr;
}


/**
 * Returns the given array as a string joined by the given glues.
 * A third parameter can be provided which will be the separator
 * between the last two elements of the array.
 * @param {array} arr - The array.
 * @param {string} glue - The glue.
 * @param {string} last_glue - The glue between the last two elements.
 * @returns {string} The given array as a string joined by the given glues.
 */
join = (arr, glue, last_glue = '') => {
    if (arr.length <= 1) {
        return arr.toString();
    }

    if (last_glue == '') {
        last_glue = glue;
    }

    let last = arr.pop();

    return arr.join(glue) + last_glue + last;
}


/**
 * Returns the given value as a number and rounded to the specified decimals.
 * If no decimal value is passed, 2 will be used by default.
 * @param {Number} number - The number.
 * @param {Number} [decimals] - The decimal places to round.
 * @returns {Number} The given value as number and rounded to the specified decimals.
 */
round = (number, decimals = 2) => {
    return parseFloat((+number).toFixed(decimals));
}
