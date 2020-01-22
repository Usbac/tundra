var http = require('http');
var Tundra = require('../src/tundra.js');
var view = new Tundra({
    'extension': 'html',
    'cache': 'cache'
});

http.createServer((req, res) => {
    var data = {
        title: 'Tundra',
        msg: 'Hello World!',
        no_escaped_html: '<p>This is a paragraph</p>',
    };

    view.render(res, 'home', data);
    res.end();
}).listen(8080);
