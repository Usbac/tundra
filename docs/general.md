For using Tundra, first require it and make an instance.

```js
const Tundra = require('tundrajs');
var view = new Tundra();
```

## Methods

### Render

`render(res, dir[, data])`

Renders the specified file, it takes three parameters.

The first is the response object, the second is the view file directory and the third is the data object with the content that will be available in the view (this parameter is optional).

Example:

```js
let data = {
    msg: 'Hello World!'
};

view.render(res, 'home.html', data);
```

### Get render

`getRender(dir[, data])`

Returns the specified file rendered by the engine, it takes two parameters.

The first is the file view directory and the second is the data object with the content that will be available in the view (this parameter is optional).

```js
let html;
let data = {
    msg: 'Hello World!'
};

html = view.getRender('home.html', data);
```

After that the `html` variable will contain the `home.html` rendered.

### Exists

`exists()`

Returns `true` if the specified view exists, `false` otherwise.

```js
view.exists('home.html');
```

In that example, if the `home.html` file doesn't exists it will return `false`.

### Set base

`setBase([dir])`

Sets the base directory to be used.

```js
view.setBase('views');
```

### Get base

`getBase()`

Returns the base directory to be used.

```js
view.getBase();
```

### Set extension

`setExtension([new_extension])`

Sets the default extension to be used.

```js
view.setExtension('html');
```

### Get extension

`getExtension()`

Returns the default extension being in use.

```js
view.getExtension();
```

### Set encoding

`setEncoding([new_encoding])`

Sets the encoding to be used.

```js
view.setEncoding('UTF-8');
```

### Get encoding

`getEncoding()`

Returns the encoding being in use.

```js
view.getEncoding();
```

### Set

This method is used to customize the template tags, explained below.

### Extend

This method is used to create custom rules for the parser, explained below.

## Defining options

`setOptions([options])`

The tundra constructor takes an optional parameter which must be an object with the following keys.

* **base**: The base directory where the view files are located, by default it's the current working directory.

* **cache**: Use or not the cache system. By default the cache is disabled.

* **encoding**: The encoding used for the files, by default it's `UTF-8`.

* **scoping**: Use or not the scope in the views (with scoping on `{{ this.msg }}`, with scoping off `{{ msg }}`).

* **extension**: The default extension used for the views, if specified, no extension must be used when specifying a view.

Or you can use the `setOptions` method with those same keys.

### Example

Using the constructor:
```js
let view = new Tundra({
    base: 'views',
    cache: true,
    encoding: 'ascii',
    extension: 'html'
});
```

Using the method:
```js
view.setOptions({
    base: 'views',
    cache: true,
    encoding: 'ascii',
    extension: 'html'
});
```

Those work exactly the same, they will:

1. Set the base directory to `views`.

2. Activate the use of the cache system.

3. Set the encoding to `ascii`.

4. Use `html` as default extension.

With that in mind, instead of this:

```js
view.render(res, 'views/home.html', data);
```

You will be able to do:

```js
view.render(res, 'home', data);
```

All of this using `ascii` as encoding for reading and writing to files and with the cache system activated.

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

_Keep in mind that the custom syntax has a higher precedence than the Tundra syntax, meaning that you can even override the native syntax._

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

## Mapping the response (Optional)

`mapResponse(res)`

Maps some of the Tundra's methods into the given `ServerResponse` object. This can be done simply for avoiding code repetition.

```js
view.mapResponse(res);
```

The methods mapped to the giving Response are `render`, `getRender` and `exists`. The methods will stay exactly the same except for the `render` method which won't require its original first parameter.

Example using the mapped methods in the Response:

```js
res.render('home.html', data);

res.getRender('home.html');

res.exists('home.html');
```
