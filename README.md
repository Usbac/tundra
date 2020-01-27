<h1 align="center">
  <img src="http://usbac.com.ve/wp-content/uploads/2019/12/Tundra.svg" alt="Tundra title" height="100">
</h1>

<p align="center">The comprehensive template engine for Nodejs.</p>

<p align="center">
<img src="https://img.shields.io/badge/stability-stable-green.svg"> <img src="https://img.shields.io/badge/version-0.7.1-blue.svg"> <img src="https://img.shields.io/badge/license-MIT-orange.svg">
</p>

Tundra is a small, fast and customizable template engine for Nodejs. It perfectly integrates with any back-end framework, even pure Nodejs.

## Features

* Easy to learn and with a small codebase.

* Cache system for speeding up the loading of views.

* Standard library with useful functions.

* Customizable syntax.

* Inheritance capabilities.

* And more...

## Code snippets

```html
{{ print_variable }}

{! print_variable_without_escaping_it !}

{# comment #}

{% var code_inside_this_tags = true %}

~{{ escape_template_tags }}

@require(imported_view.html)

@extends(parent_view.html)

{[ block name ]}
    {[ parent block_name ]}
{[ endblock ]}
```

## Example

Rendering a simple view

main.js:

```js
var http = require('http');
var Tundra = require('tundrajs');
var view = new Tundra();

http.createServer((req, res) => {
    var data = {
        title: 'Tundra',
        msg: 'Hello World!'
    };

    view.render(res, 'home.html', data);
    res.end();
}).listen(8080);
```

home.html:
```html
<!DOCTYPE html>
    <head>
        <title>{{ title }}</title>
    </head>
    <body>
        {{ msg }}
    </body>
</html>
```

## Tests

To run the test suite, follow these steps:

* Open your terminal and move to your Tundra folder. 

* Run `npm update --save-dev` to install the dependencies.

* Run `npm test`.

* Open `http://localhost:8080` in your browser to see the testing view.

## Contributing

Any contribution or support to this project in the form of a issue, pull request or message will be highly appreciated.

Don't be shy :)

## License

Tundra is open-source software licensed under the [MIT license](https://github.com/Usbac/Tundra/blob/master/LICENSE).
