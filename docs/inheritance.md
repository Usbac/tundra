Inheritance is a very useful tool for avoiding code repetition in views.

Tundra supports it, but it doesn't support multiple inheritance.

## General

The parent view can have multiple blocks which will be used by the child views to redefine what is inside.

A child view must extends from a parent, you can specify that with the following syntax:

```
@extends(parent_view.html)
```

_It's recommended to have this tag at the top of the child file._

### Getting a block content in the child view

To get the content of a parent view block, just use the following syntax:

```
{[ parent block_name ]}
```

That will put the content of the indicated block in that line.

## Example

### Parent view

Example of a parent view content (`base.html`):

```html
<!DOCTYPE html>
<head>
    {[ block head ]}
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
    {[ endblock ]}
</head>
<body>
    {[ block body ]}
    {[ endblock ]}
</body>
</html>
```

### Child view

Example of a child view content (`sub.html`):

```html
@extends(base.html)

{[ block head ]}
    {[ parent head ]}
    <title>Tundra</title>
{[ endblock ]}

{[ block body ]}
    <div>Hello world</div>
{[ endblock ]}
```

Given the two examples of the files shown above, the following call:

```js
view.render(res, 'sub.html');
```

Should render the following:

```html
<!DOCTYPE html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Tundra</title>
</head>
<body>
    <div>Hello world</div>
</body>
</html>
```
