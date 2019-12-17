<h1 align="center">
  <br>
  <img src="http://usbac.com.ve/wp-content/uploads/2019/12/Tundra title.svg" alt="Tundra title" height="150">
  <br>
  Tundra
  <br>
</h1>

<h4 align="center">The comprenhensive template engine.</h4>

<p align="center">
<img src="https://img.shields.io/badge/stability-experimental-green.svg"> <img src="https://img.shields.io/badge/version-0.1.3-blue.svg"> <img src="https://img.shields.io/badge/license-MIT-orange.svg">
</p>

Tundra is a small, fast and customizable template engine for Javascript. It perfectly integrates with any back-end framework or technology.

## Features

* Easy to learn and with a small codebase.

* Cache system for speeding up the loading of views.

* Customizable syntax.

* Standard library with useful functions.

* Inheritance capabilities

* And more...

## Code snippets

```html
{{ variable }}

{! no_escaped_variable !}

{# comment #}

{% var code_inside_this_tags = true %}

@require(imported_view.html)

@extends(parent_view.html)

{[ block name ]}
    {[ parent block_name ]}
{[ endblock ]}
```

## Example

Rendering a simple view

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

## Contributing

Any contribution or support to this project in the form of a pull request or message will be highly appreciated.

Don't be shy :)

## License

Tundra is open-source software licensed under the [MIT license](https://github.com/Usbac/Tundra/blob/master/LICENSE).
