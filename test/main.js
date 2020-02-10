var http = require('http');
var assert = require('assert');
var Tundra = require('../src/tundra.js');

// Test general methods
describe('Tundra', function() {
    let Cache = require('../src/cache.js');
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

    it('exists() should return true when a view exists (\'home\')', function() {
        assert.ok(view.exists('home'));
    });

    it('cache.get() should return its corresponding content', function() {
        cache.set('sub/home', `with (this) {
            let arr = [];
            arr.push('<p>Hello world</p>');
            return arr.join('');
        }`);

        assert.equal(cache.get('sub/home'), '<p>Hello world</p>');
    });

    it('cache.exists() should return true when a cache exists', function() {
        cache.set('blog/post', '{}');
        assert.ok(cache.exists('blog/post'));
    });

    it('Methods should be correctly mapped into the response through mapResponse()', function() {
        let res = {};
        view.mapResponse(res);
        assert.ok(typeof res.render === 'function');
        assert.ok(typeof res.getRender === 'function');
        assert.ok(typeof res.exists === 'function');
    });
});

// Test view rendering
http.createServer((req, res) => {
    let view = new Tundra({
        'cache': true,
        'base': 'test/views',
        'extension': 'html'
    });

    let data = {
        title: 'Tundra',
        msg: 'Hello World!',
        no_escaped_html: '<b>This is text between b tags (html characters not escaped).</b>',
        view_exists: view.exists('home')
    };

    view.render(res, 'home', data);
    view.render(res, 'child');
    res.end();
}).listen(8080);
