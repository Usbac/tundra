const http = require('http');
const url = require('url');
const assert = require('assert');
const request = require('supertest');
const Tundra = require('../src/tundra.js');
const Cache = require('../src/cache.js');

const EXPECTED_VIEW = '<!DOCTYPE html>\n    <head>\n        <title>Tundra</title>\n    </head>\n    <body>\n        \n        <p><b>This is text between b tags (html characters not escaped).</b></p>\n\n        custom_msg\n        <p>This is a escaped template tag: {{ msg }}</p>\n\n        \n\n        \n            <p>This is inside a Js condition</p>\n        \n\n        <p>Using the stdlib:</p>\n        7.5<br>\n        -7.5<br>\n        5.06<br>\n        Lorem <br>\n         dolor sit<br>\n        Lorem  dolor sit<br>\n        Lorem ipsum dolor sit<br>\n        1,2,3,4,5,6,7,8,9,10<br>\n        you, me and I<br>\n        1.45<br>\n    </body>\n</html>\n\n<div>\n    Tundra - The comprehensive template engine\n</div>\n\n\n\n            hello\n';
const EXPECTED_CHILD_VIEW = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    \n    \n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta http-equiv="X-UA-Compatible" content="ie=edge">\n    \n    <title>I\'m child view</title>\n\n</head>\n<body>\n    \n    <p>Hello world from a child view</p>\n\n</body>\n</html>\n`;


describe('General', function() {
    let view = new Tundra({
        'cache': true
    });

    it('getRender() should return the view rendered', function() {
        let sub_view = new Tundra({
            'cache': false,
            'scoping': false,
            'encoding': 'UTF-8',
        });

        assert.equal('<p>hello alex</p>\n', sub_view.getRender('test/views/small.html', {
            'user': 'alex'
        }));
    });

    it('getRender() should return false when the view doesn\'t exists', function() {
        let sub_view = new Tundra({
            'cache': false
        });

        assert.equal(false, sub_view.getRender('test/views/non_existent.html'));
    });

    it('getRender() should return false when the view doesn\'t exists and it\'s not cached', function() {
        let sub_view = new Tundra({
            'cache': true
        });

        assert.equal(false, sub_view.getRender('test/views/non_existent.html'));
    });

    it('getBase() should return the previously set base value through setBase()', function() {
        view.setBase('test/views');
        assert.equal('test/views', view.getBase());
    });

    it('getExtension() should return the previously set extension value through setExtension()', function() {
        view.setExtension('html');
        assert.equal('html', view.getExtension());
    });

    it('getEncoding() should return the previously set encoding value through setEncoding()', function() {
        view.setEncoding('UTF-8');
        assert.equal('UTF-8', view.getEncoding());
    });

    it('exists() should return true when a view exists', function() {
        assert.ok(view.exists('home'));
    });

    it('exists() should return false when a view does not exists', function() {
        assert.equal(false, view.exists('login'));
    });

    it('methods should be correctly mapped into the response through mapResponse()', function() {
        let res = {};
        view.mapResponse(res);
        assert.ok(typeof res.render === 'function');
        assert.ok(typeof res.getRender === 'function');
        assert.ok(typeof res.exists === 'function');
    });
});


describe('Cache', function() {
    let cache = new Cache();

    it('get() should return its corresponding content', function() {
        cache.set('sub/home', `with (this) {
            let arr = [];
            arr.push('<p>Hello world</p>');
            return arr.join('');
        }`);

        assert.equal(cache.get('sub/home'), '<p>Hello world</p>');
    });

    it('has() should return true when a cache exists', function() {
        cache.set('blog/post', '{}');
        assert.ok(cache.has('blog/post'));
    });

    it('get() should return false when a cache does not exists', function() {
        assert.equal(false, cache.get('blog/login'));
    });

    it('has() should return false when a cache does not exists', function() {
        cache.set('blog/post', '{}');
        assert.equal(false, cache.has('blog/login'));
    });
});


describe('Standard library', function() {
    require('../src/stdlib.js');

    it('sum() should return the correct sum', function() {
        assert.equal(sum('2.5', 3, 2), 7.5);
    });

    it('subtract() should return the correct subtraction', function() {
        assert.equal(subtract('2.5', 3, 2), -7.5);
    });

    it('average() should return the correct average', function() {
        assert.equal(average([4.5, 6, 3, 2.8, 9]), 5.06);
    });

    it('escape() should return the given string escaped', function() {
        assert.equal(escape('hello <p>alex</p>'), 'hello &lt;p&gt;alex&lt;/p&gt;');
    });

    it('strBefore() should return everything before the given substring', function() {
        assert.equal(strBefore('how are you?', 'are'), 'how ');
    });

    it('strAfter() should return everything after the given substring', function() {
        assert.equal(strAfter('how are you?', 'are'), ' you?');
    });

    it('remove() should return the given string with the substring removed', function() {
        assert.equal(remove('hoow are yoou?', 'oo'), 'hw are yu?');
    });

    it('titleCase() should return the given string with its whitespaces trimmed and its first letter uppercase', function() {
        assert.equal(titleCase(' welcome back user  '),  'Welcome back user');
    });

    it('capitalize() should return the given string with with all its words starting with uppercase letters', function() {
        assert.equal(capitalize('welcome back deer user'),  'Welcome Back Deer User');
    });

    it('range() should return an array with the given range', function() {
        assert.deepEqual(range(5, 3), []);
        assert.deepEqual(range(1, 5, 1), [ 1, 2, 3, 4, 5]);
    });

    it('join() should return the given array as a string joined by the given glue', function() {
        assert.equal(join([]), '');
        assert.equal(join([ 'you\'re', 'a', 'toymaker\'s', 'creation' ], ' '), 'you\'re a toymaker\'s creation');
        assert.equal(join([ 'you\'re', 'a', 'toymaker\'s', 'creation' ], ' ', '-'), 'you\'re a toymaker\'s-creation');
    });

    it('round() should return the given number rounded', function() {
        assert.equal(round('2.56666'), 2.57);
    });
});


describe('Engine', function() {
    let local_req = request(`http://localhost:8080`);

    it('should render a sample view correctly', function(done) {
        local_req.get('/home').expect(EXPECTED_VIEW, done);
    });

    it('should render a sample child view correctly', function(done) {
        local_req.get('/child').expect(EXPECTED_CHILD_VIEW, done);
    });

    it('should render a sample view correctly with the response object mapped', function(done) {
        local_req.get('/res/home').expect(EXPECTED_VIEW, done);
    });

    it('should return a sample view correctly with the response object mapped', function(done) {
        local_req.get('/res/get_home').expect(EXPECTED_VIEW, done);
    });

    it('should render a sample child view correctly with the response object mapped', function(done) {
        local_req.get('/res/child').expect(EXPECTED_CHILD_VIEW, done);
    });

    it('should render true when a view does exists with the response object mapped', function(done) {
        local_req.get('/res/exists').expect('true', done);
    });
});


// Server
http.createServer((req, res) => {
    let view = new Tundra({
        'cache': true,
        'base': 'test/views',
        'extension': 'html'
    });

    let data = {
        title: 'Tundra',
        no_escaped_html: '<b>This is text between b tags (html characters not escaped).</b>',
    };

    let pathname = url.parse(req.url).pathname;

    view.mapResponse(res);
    view.set('print', '{{', '}}');
    view.extend(str => {
        return str.replace('old_text_to_replace', 'custom_msg');
    });

    // View rendering
    switch (pathname) {
        case '/home':
            view.render(res, 'home', data);
            break;
        case '/child':
            view.render(res, 'child');
            break;
        case '/res/home':
            res.render('home', data);
            break;
        case '/res/child':
            res.render('child');
            break;
        case '/res/get_home':
            res.write(res.getRender('home', data));
            break;
        case '/res/exists':
            res.write(res.exists('home').toString());
            break;
    }

    res.end();
}).listen(8080);

setTimeout(() => process.exit(0), 3000)
