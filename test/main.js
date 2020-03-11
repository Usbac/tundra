const http = require('http');
const url = require('url');
const assert = require('assert');
const request = require('supertest');
const Tundra = require('../src/tundra.js');
const Cache = require('../src/cache.js');

const EXPECTED_VIEW = '<!DOCTYPE html>\n    <head>\n        <title>Tundra</title>\n    </head>\n    <body>\n\n        <p><b>This is text between b tags (html characters not escaped).</b></p>\n\n        <p>This is a escaped template tag: {{ msg }}</p>\n\n        \n\n        \n            <p>This is inside a Js condition</p>\n        \n\n        <p>Using the stdlib:</p>\n        7.5<br>\n        -7.5<br>\n        5.06<br>\n        Lorem <br>\n         dolor sit<br>\n        Lorem  dolor sit<br>\n        Lorem ipsum dolor sit<br>\n        1,2,3,4,5,6,7,8,9,10<br>\n        you, me and I<br>\n        1.45<br>\n    </body>\n</html>\n\n<div>\n    Tundra - The comprehensive template engine\n</div>\n\n';
const EXPECTED_CHILD_VIEW = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    \n    \n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta http-equiv="X-UA-Compatible" content="ie=edge">\n    \n    <title>I\'m child view</title>\n\n</head>\n<body>\n    \n    <p>Hello world from a child view</p>\n\n</body>\n</html>\n`;


// Test general methods
describe('General', function() {
    let cache = new Cache();
    let view = new Tundra({
        'cache': true
    });

    it('getBase() should return the previously set base value through setBase()', function() {
        let actual = 'test/views';
        view.setBase(actual);
        assert.equal(actual, view.getBase());
    });

    it('getExtension() should return the previously set extension value through setExtension()', function() {
        let actual = 'html';
        view.setExtension(actual);
        assert.equal(actual, view.getExtension());
    });

    it('getEncoding() should return the previously set encoding value through setEncoding()', function() {
        let actual = 'UTF-8';
        view.setEncoding(actual);
        assert.equal(actual, view.getEncoding());
    });

    it('exists() should return true when a view exists', function() {
        assert.ok(view.exists('home'));
    });

    it('exists() should return false when a view does not exists', function() {
        assert.equal(false, view.exists('login'));
    });

    describe('Cache', function() {
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

        it('has() should return false when a cache does not exists', function() {
            cache.set('blog/post', '{}');
            assert.equal(false, cache.has('blog/login'));
        });
    });

    it('methods should be correctly mapped into the response through mapResponse()', function() {
        let res = {};
        view.mapResponse(res);
        assert.ok(typeof res.render === 'function');
        assert.ok(typeof res.getRender === 'function');
        assert.ok(typeof res.exists === 'function');
    });
});


describe('View rendering', function() {
    let local_req = request(`http://localhost:8080`);

    it('should render a sample view correctly', function(done) {
        local_req.get('/home').expect(EXPECTED_VIEW, done);
    });

    it('should render a sample child view correctly', function(done) {
        local_req.get('/child').expect(EXPECTED_CHILD_VIEW, done);
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

    // View rendering
    if (url.parse(req.url).pathname === '/home') {
        view.render(res, 'home', data);
    } else if (url.parse(req.url).pathname === '/child') {
        view.render(res, 'child');
    }

    res.end();
}).listen(8080);
