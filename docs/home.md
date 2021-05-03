Tundra is a small, fast and customizable template engine for Javascript.

For installing it just run:

```
npm install tundrajs
```

## Example

The following example is done in pure Nodejs but Tundra integrates well with existing frameworks like Express.

```js
var http = require('http');
var Tundra = require('tundrajs');
var view = new Tundra();

http.createServer((req, res) => {
    view.render(res, '<p>{{ msg }}</p>', {
        msg: 'Hello World!',
    });
}).listen(8080);
```

## Tests

For running the Tundra tests, follow these steps:

1. Open your terminal and move to your Tundra folder.

2. Run `npm update --save-dev` to install the dependencies.

3. Run `npm test`.
