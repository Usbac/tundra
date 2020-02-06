var http = require('http');
var assert = require('assert');
var Tundra = require('../src/tundra.js');

// Test general methods
describe('Tundra', function() {
    let view = new Tundra();

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
        assert.equal(true, view.exists('home'));
    });

    it('Methods should be correctly mapped into the response through mapResponse()', function() {
        let res = {};
        view.mapResponse(res);
        assert.equal(true, typeof res.render === 'function');
        assert.equal(true, typeof res.getRender === 'function');
        assert.equal(true, typeof res.exists === 'function');
    });
});

// Test view rendering
http.createServer((req, res) => {
    let view = new Tundra({
        'cache': 'test/cache',
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
