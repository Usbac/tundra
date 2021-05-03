For using Tundra, first require it and make an instance.

```js
const Tundra = require('tundrajs');
var view = new Tundra();
```

## Methods

### Render

`render(res, content[, data])`

Renders the specified content, it takes three parameters.

The first is the response object, the second is the template content and the third is the data object with the content that will be available in the view (this parameter is optional).

Example:

```js
view.render(res, '<p>{{ msg }}</p>', {
    msg: 'Hello World!',
});
```

### Get render

`getRender(content[, data]): string`

Returns the specified template content rendered by the engine, it takes two parameters.

The first is the template content and the second is the data object with the content that will be available in the view (optional).

```js
let html = view.getRender('<p>{{ msg }}</p>', {
    msg: 'Hello World!',
});
```

After that, the `html` variable will contain the string `<p>Hello World!</p>`.

### Set

This method is used to customize the template tags, explained below.

### Extend

This method is used to create custom rules for the parser, explained below.

## Defining options

The tundra constructor takes an optional parameter which must be an object with the following keys.

* **base**: The base directory used for the required files, by default it's the current working directory.

* **encoding**: The encoding used for the required files, by default it's `UTF-8`.

* **scoping**: Use or not the scope in the views (with scoping on `{{ this.msg }}`, with scoping off `{{ msg }}`).

### Example

```js
let view = new Tundra({
    base: 'views',
    encoding: 'ascii',
});
```

It will:

1. Set the base directory to `views`.

2. Set the encoding to `ascii`.

## Extending Tundra

`extend(function)`

You can define custom rules or syntax for the Tundra parser with the `extend` method, so you can even create your own tags and modifications on the go.

The function must take a string and return a string, this is supposed to be the view content. You can do whatever you want with it in the function.

```js
view.extend(content => {
    return content.replace('old msg', 'new msg');
});
```

The above example will replace the text `old msg` with the text `new msg` in the views, so now the following html code:

```html
<p>This is an old msg</p>
```

Will be replaced by this:

```html
<p>This is an new msg</p>
```

_Keep in mind that the custom syntax has a higher precedence than the Tundra syntax, meaning that you can even override the native functionality._

## Customizing tags

`set(key, first_val[, last_val])`

With the `set` method you can customize most of the Tundra tags to your convenience.

This method takes three parameters: the key or tag name to modify, the first value of the tag (left side) and the second or last value of the tag (right side). The last parameter is unnecessary when modifying the `raw` tag.

The available keys/tags to modify are the following:

| key         | description                           | default value |
|-------------|---------------------------------------|---------------|
| code        | Put Js code                           | {% %}         |
| print       | Print content                         | {{ }}         |
| print_plain | Print content without escaping it     | {! !}         |
| comment     | Comments                              | {# #}         |
| raw         | Prefix used to escape the Tundra tags | ~             |

### Example

```js
view.set('code', '((', '))');
```

After that you will be able to put code in your views this way:

```
(( var foo = true ))
```
