const http = require('http');
const url = require('url');
const fs = require('fs');
const assert = require('assert');
const request = require('supertest');
const Tundra = require('../src/tundra.js');

const PORT = 3000;
const EXPECTED_VIEW = '<!DOCTYPE html>\n    <head>\n        <title>Tundra</title>\n    </head>\n    <body>\n        \n        <p><b>Hello.</b></p>\n\n        custom_msg\n        <p>This is a escaped template tag: {{ msg }}</p>\n\n        \n\n        \n    </body>\n</html>\n\n<div>\n    Tundra - The comprehensive template engine\n</div>\n\n\n\n            hello\n';
const EXPECTED_CHILD_VIEW = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    \n    \n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta http-equiv="X-UA-Compatible" content="ie=edge">\n    \n    <title>I\'m child view</title>\n\n</head>\n<body>\n    \n    <p>Hello world from a child view</p>\n\n</body>\n</html>\n`;


describe('General', function() {
    let view = new Tundra();

    it('getRender() should return the view rendered', function() {
        assert.strictEqual('<p>hello alex</p>', view.getRender('<p>hello {{ user }}</p>', {
            'user': 'alex',
        }));
    });

    it('set() should return true when a valid key is given', function() {
        assert.strictEqual(true, view.set('print', '{{', '}}'));
    });

    it('set() should return false when an invalid key is given', function() {
        assert.strictEqual(false, view.set('echo', '{{', '}}'));
    });
});


describe('Standard library', function() {
    require('../src/stdlib.js');

    it('sum() should return the correct sum', function() {
        assert.strictEqual(sum('2.5', 3, 2), 7.5);
    });

    it('subtract() should return the correct subtraction', function() {
        assert.strictEqual(subtract('2.5', 3, 2), -7.5);
    });

    it('average() should return the correct average', function() {
        assert.strictEqual(average([4.5, 6, 3, 2.8, 9]), '5.06');
    });

    it('escape() should return the given string escaped', function() {
        assert.strictEqual(escape('hello <p>alex</p>'), 'hello &lt;p&gt;alex&lt;/p&gt;');
    });

    it('strBefore() should return everything before the given substring', function() {
        assert.strictEqual(strBefore('how are you?', 'are'), 'how ');
    });

    it('strAfter() should return everything after the given substring', function() {
        assert.strictEqual(strAfter('how are you?', 'are'), ' you?');
    });

    it('remove() should return the given string with the substring removed', function() {
        assert.strictEqual(remove('hoow are yoou?', 'oo'), 'hw are yu?');
    });

    it('titleCase() should return the given string with its whitespaces trimmed and its first letter uppercase', function() {
        assert.strictEqual(titleCase(' welcome back user  '),  'Welcome back user');
    });

    it('capitalize() should return the given string with with all its words starting with uppercase letters', function() {
        assert.strictEqual(capitalize('welcome back deer user'),  'Welcome Back Deer User');
    });

    it('range() should return an array with the given range', function() {
        assert.deepStrictEqual(range(5, 3), []);
        assert.deepStrictEqual(range(1, 5, 1), [ 1, 2, 3, 4, 5]);
    });

    it('join() should return the given array as a string joined by the given glue', function() {
        assert.strictEqual(join([]), '');
        assert.strictEqual(join([ 'you\'re', 'a', 'toymaker\'s', 'creation' ], ' '), 'you\'re a toymaker\'s creation');
        assert.strictEqual(join([ 'you\'re', 'a', 'toymaker\'s', 'creation' ], ' ', '-'), 'you\'re a toymaker\'s-creation');
    });

    it('round() should return the given number rounded', function() {
        assert.strictEqual(round('2.56666'), 2.57);
    });
});


describe('Engine', function() {
    let local_req = request(`http://localhost:${PORT}`);

    it('should render a sample view correctly', function(done) {
        local_req.get('/home').expect(EXPECTED_VIEW, done);
    });

    it('should render a sample child view correctly', function(done) {
        local_req.get('/child').expect(EXPECTED_CHILD_VIEW, done);
    });

    it('should render a sample view correctly with getRender()', function(done) {
        local_req.get('/res/home').expect(EXPECTED_VIEW, done);
    });

    it('should render a sample child view correctly with getRender()', function(done) {
        local_req.get('/res/child').expect(EXPECTED_CHILD_VIEW, done);
    });
});


http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    let view = new Tundra({
        'base': 'test/views',
    });

    let data = {
        title: 'Tundra',
        no_escaped_html: '<b>Hello.</b>',
    };

    view.set('print', '{{', '}}');
    view.extend(str => {
        return str.replace('old_text_to_replace', 'custom_msg');
    });

    switch (pathname) {
        case '/home':
            view.render(res, fs.readFileSync('test/views/home.html').toString(), data);
            break;
        case '/child':
            view.render(res, fs.readFileSync('test/views/child.html').toString());
            break;
        case '/res/home':
            res.write(view.getRender(fs.readFileSync('test/views/home.html').toString(), data));
            break;
        case '/res/child':
            res.write(view.getRender(fs.readFileSync('test/views/child.html').toString(), data));
            break;
    }

    res.end();
}).listen(PORT);

setTimeout(() => process.exit(0), 1000);
