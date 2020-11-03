Tundra is a small, fast and customizable template engine for Javascript.

For installing it just run:

```
npm install tundrajs
```

## Example

The following example is done in pure Nodejs but Tundra integrates well with existing frameworks like `Express` :)

Controller:

```js
var http = require('http');
var Tundra = require('tundrajs');
var view = new Tundra();

http.createServer((req, res) => {
    view.render(res, 'home.html', {
        msg: 'Hello World!'
    });
}).listen(8080);
```

View:

```html
<!DOCTYPE html>
    <head>
        <title>Tundra</title>
    </head>
    <body>
        {{ msg }}
    </body>
</html>
```
