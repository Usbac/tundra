For using Tundra, first require it and make an instance.

```js
const Tundra = require('tundrajs');
var view = new Tundra();
```

## Mapping the response

`mapResponse(res)`

The `mapResponse` method will map some of the Tundra's methods into the giving `ServerResponse` object. This can be done simply for avoiding code repetition.

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

## Methods

### Render

`render(res, dir[, data])`

This method will render the specified file to the response, it takes three parameters.

The first is the request object, the second is the view directory and the third is the data object with the content that will be available in the view (this parameter is optional).

Example:

```js
let data = {
    msg: 'Hello World!'
};

view.render(res, 'home.html', data);
```

### Get render

`getRender(dir[, data])`

This method will return the specified view rendered by the engine, it takes two parameters.

The first is the view directory and the second is the data object with the content that will be available in the view (this parameter is optional).

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

This will set the base directory to be used.

```js
view.setBase('views');
```

### Get base

`getBase()`

This will return the base directory to be used.

```js
view.getBase();
```

### Set extension

`setExtension([new_extension])`

This will set the default extension to be used.

```js
view.setExtension('html');
```

### Get extension

`getExtension()`

This will return the default extension being in use.

```js
view.getExtension();
```

### Set encoding

`setEncoding([new_encoding])`

This will set the encoding to be used.

```js
view.setEncoding('UTF-8');
```

### Get encoding

`getEncoding()`

This will return the encoding being in use.

```js
view.getEncoding();
```

### Set

This method is used to customize the template tags, explained below.

## Defining options

`setOptions([options])`

The tundra constructor takes an optional parameter which must be an object with the following keys.

* **base**: The base directory where the view files are located, by default it's the current working directory.

* **cache**: Use or not the cache system. By default the cache is disabled.

* **encoding**: The encoding used for the files, by default it's `UTF-8`.

* **scoping**: Use or not the scope in the views. With scoping on `{{ this.msg }}`, with scoping off `{{ msg }}`.

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

All of this using `ascii` as encoding for reading and writing to files.


## Customizing tags

`set(key, first_val[, last_val])`

With the `set` method you can customize most of the Tundra tags to your convenience.

That method takes three parameters, the key or tag name to modify, the first value of the tag (left side) and the second or last value of the tag (right side). The last parameter is unnecessary when modifying the `raw` tag.

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
