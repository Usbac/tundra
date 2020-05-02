Tundra is a small, fast and customizable template engine for Javascript.

For installing it just run:

```
npm install tundrajs
```

## Features

* Easy to learn and with a small codebase.

* Cache system for speeding up the loading of views.

* Customizable syntax.

* Standard library with useful functions.

* Inheritance capabilities.

* Reusable code blocks.

* And more...

## Example

The following example is done in pure Nodejs but Tundra integrates well with existing frameworks like `Express` :)

Controller:

```js
var http = require('http');
var Tundra = require('tundrajs');
var view = new Tundra();

http.createServer((req, res) => {
    var data = {
        msg: 'Hello World!'
    };

    view.render(res, 'home.html', data);

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
