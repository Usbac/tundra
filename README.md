<h1 align="center">
  <img src="https://github.com/Usbac/tundra/assets/38147742/23dfc59b-20ec-40e7-9841-bc6103d384f5" alt="Tundra logo" width="140">
  <br>
  Tundra
  <br>
</h1>

<p align="center">The comprehensive template engine for Nodejs.</p>

<p align="center">
    <img src="https://travis-ci.org/Usbac/tundra.svg?branch=master">
    <img src="https://img.shields.io/badge/stable-3.0.0-blue.svg">
    <img src="https://img.shields.io/badge/license-MIT-orange.svg">
</p>

Tundra is a small, fast, customizable and easy to use template engine. It perfectly integrates with any back-end made in Js, even pure Nodejs.

## Features

* Easy to learn and lightweight.

* Standard library with useful functions.

* Customizable syntax.

* Inheritance capabilities.

* Reusable code blocks.

And **much** more...

## Code snippets

```html
{{ print_variable }}

{! print_variable_without_escaping_it !}

{# comment #}

{% var code_inside_this_tags = true %}

~{{ escape_template_tags }}

@require(imported_view.html)

@spread(hello)

{[ spread hello ]}
{[ endspread ]}

@extends(parent_view.html)

{[ block name ]}
    {[ parent block_name ]}
{[ endblock ]}
```

## Example

Rendering a view in pure Nodejs web server is this simple:

```js
var http = require('http');
var Tundra = require('tundrajs');
var view = new Tundra();

http.createServer((req, res) => {
    view.render(res, '<p>{{ msg }}<p>', {
        msg: 'Hello World!',
    });

    res.end();
}).listen(8080);
```

## Tests

To run the test suite, follow these steps:

1. Open your terminal and move to your Tundra folder.

2. Run `npm update --save-dev` to install the dependencies.

3. Run `npm test`.

## Documentation

The documentation is available at the [wiki page](https://github.com/Usbac/tundra/wiki).

* [General usage](https://github.com/Usbac/tundra/wiki/General)

* [Standard library](https://github.com/Usbac/tundra/wiki/Standard-library)

* [Syntax](https://github.com/Usbac/tundra/wiki/Syntax)

* [View inheritance](https://github.com/Usbac/tundra/wiki/Syntax)

## VSC Extension

There's a syntax highlighting extension of Tundra available for Visual Studio Code, download it here:

### [Tundra - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=usbac.tundra)

## Contributing

Any contribution or support to this project in the form of a issue, pull request or message will be highly appreciated. ❤️

You can read more about it [right here](CONTRIBUTING.md). Don't be shy :)

## License

Tundra is open-source software licensed under the [MIT license](https://github.com/Usbac/Tundra/blob/master/LICENSE).
