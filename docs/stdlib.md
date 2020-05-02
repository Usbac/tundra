Tundra has a standard library with some useful global functions that can be used in the views.

These functions can be called without referring to any object, just like they were native.

## Functions

### Title Case

`titleCase(str)`

Returns the given string with the first letter uppercase.

```js
titleCase('hello world');
```

That will return `Hello world`.

### Capitalize

`capitalize(str)`

Returns the given string with all its words starting with uppercase letters.

```js
capitalize('lorem ipsum dolor sit amet');
```

That will return `Lorem Ipsum Dolor Sit Amet`.

### Range

`range(start, end[, steps])`

Returns an array containing the given numbers from the specified start to the specified end.

```js
range(1, 10);
```

That will return `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`.

An optional third parameter can be passed which is the steps between numbers.

```js
range(1, 10, 2);
```

That will return `[1, 3, 5, 7, 9]`.

### Join

`join(arr, glue[, last_glue])`

Returns the specified array as a string joined by the given glues.

```js
var names = ['Thomas', 'Bruce', 'Margaret']
join(names, ', ');
```

That will return `Thomas, Bruce, Margaret`.

A third parameter can be provided which will be the separator between the last two elements of the array.

```js
var names = ['Thomas', 'Bruce', 'Margaret']
join(names, ', ', ' and ');
```

That will return `Thomas, Bruce and Margaret`.

### Round

`round(number[, decimals])`

Returns the given value rounded to the specified digits, the variable will be treated as a number and returned as such.

```js
round('2.568', 2);
```

That will return `2.57`.

### Sum

`sum(...args)`

This functions takes any numbers of parameters and will return the sum of all of them treated as numbers.

```js
sum(1, "2.5", 3);
```

That will return `6.5`.

### Subtract

`subtract(...args)`

This functions takes any numbers of parameters and will return the subtraction of all of them treated as numbers.

```js
subtract("2.5", "0.5", 1);
```

That will return `1`.

### Average

`average(numbers[, decimals])`

Returns the average number of the giving array of numbers.

The first parameter is the array with the numbers, the second parameter is optional and is the number of decimals in the number to return. By default it's 2.

```js
let numbers = [4.5, 6, 3, 2.8, 9];
average(numbers);
```

That will return `5.06`.

```js
average(numbers, 3);
```

That will return `5.060`.

### String remove

`remove(str, substr)`

Returns a string without the specified substring.

The first parameter is the original string, the second is the substring that will cut it.

```js
remove('Lorem ipsum dolor sit amet', 'dolor');
```

That will return `Lorem ipsum  sit amet`.

### String after

`strAfter(str, substr)`

Returns everything after the specified subtring.

```js
strAfter('Lorem ipsum dolor sit amet', 'dolor');
```

That will return ` sit amet`.

### String before

`strBefore(str, substr)`

Returns everything before the specified subtring.

```js
strBefore('Lorem ipsum dolor sit amet', 'dolor');
```

That will return `Lorem ipsum `.

### Escape html

`escape(str)`

Returns the giving string with the html tags escaped.

```js
escape('<h2>Hello world</h2>');
```

That will return `&lt;h2&gt;Hello world&lt;/h2&gt;`.

### Url

`url(req, route)`

Returns the giving string as a local url. Useful for redirections and links.

The first parameter is the current request object, the second the url to get.

```js
url(req, 'user/info');
```

If running in localhost through the port 8080 that will return `http://localhost:8080/user/info`.
