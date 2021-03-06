This is the available syntax for the Tundra views.

## Print

This will print anything insite the tags, included variables contained in the data object passed to the `render` or `getRender` method.

```
{{ variable }}
```

_For your safety anything printed inside this tags will be escaped._

## Raw print

This will print anything insite the tags, included variables contained in the data object passed to the `render` or `getRender` method without escaping it.

```
{! variable !}
```

_Be careful about what will be printed in that tags since it will NOT be escaped in any way._

## Comments

The comments of Tundra have an advantage over the common HTML comments, and is that these comments won't be rendered to the user.

```
{# comment #}
```

The comments accept multilines too.

```
{#
This
is a multiline
comment
#}
```

## Code

Any type of Javascript code can be put between the `{% %}` tags.

```js
{% var code_inside_this_tags = true %}
```

Tundra doesn't limit you about what kind of code can be put between those tags, so that it's up to you.

### Brackets

The brackets `{ }` used for conditionals and cycles in normal Js code can be replaced by `:` and `end`, this is just syntactic sugar.

Normal:
```js
{% if (true) { %}
    //Code
{% } %}
```

Syntactic sugar:
```js
{% if (true): %}
    //Code
{% end %}
```

## Escaping

If you want to escape the template tags just prefix it with a hypen character `~`, like this:

```
~{{ msg }}
```

That will leave this in the HTML returned to the client:

```
{{ msg }}
```

## Requiring views

To get the content of another view in the current one you can use the `require` tag.

```
@require(imported_view.html)
```

That will put all the content of the `imported_view.html` file in that line.

If it doesn't exists, the line will be empty and an error will be printed in console.

_Included views have access to the variables in the current context._

_The path inside this tag is relative to the base directory variable._

## Spreads (Reusable code blocks)

In Tundra you can define and use reusable code blocks in your views, useful for avoiding code repetition.

This reusable code blocks are called spreads.

### Defining

Example defining a spread:

```html
{[ spread hello ]}
    Hello world
{[ endspread ]}
```

### Using

Example requesting it:

```html
@spread(hello)
```

That will put all the content of the `hello` spread in that line.

### Example

Here is a more complete example of a spread in a view:

```html
{[ spread hello ]}
    {% var msg = 'hello' %}
    {{ msg }}
{[ endspread ]}

<!DOCTYPE html>
    <head>
        <title>{{ title }}</title>
    </head>
    <body>
        @spread(hello)
    </body>
</html>
```

That should leave the following code:

```html
<!DOCTYPE html>
    <head>
        <title>{{ title }}</title>
    </head>
    <body>
        {% var msg = 'hello' %}
        {{ msg }}
    </body>
</html>
```

_Spreads can be defined anywhere in your file and can be requested as many times as you want._
