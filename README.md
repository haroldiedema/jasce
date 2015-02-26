# JasCe: JavaScript Compiler Engine

> __This project is in early development!__

JasCe (JavaScript Compiler Engine) is a JavaScript compiler that utilizes compiler-annotations, similar to the famous line `'use strict';`. The program compiles all source into one single JavaScript file which can then be minified by another program of your choice. Perhaps in the future, we'll add one of our own...

### Why would I need this?
Good question. There are several "compilers" or rather "build-tools" available already that can do the job pretty well. However, when it comes to combining multiple JavaScript files, it usually boils down to simple file concatination. That basically means that the program pastes one file after another. This creates a very big problem for large applications or libraries: scoping.

File concatination requires you to have some global variable available where you place your code in, so it becomes shared across different files. You're basically forced to clutter the global scope with at least one function or object.

With JasCe, you can perform inline inclusions using 'native' compiler annotations. You can even specify optional compiler arguments to let certain files only be included when some parameters are passed to the compiler (e.g `--with-debug`).

Here's a quick example:

```javascript
// test.js
(function () {
    'include src/foobar.js';
}());
```

```javascript
// foobar.js
console.log('Hello World!');
```

When compiled, the final result would be:
```javascript
// test.js
(function () {
    // foobar.js
    console.log('Hello World!');
}());
```

### Conditional inclusions

Sometimes you wish to create a build for a specific platform - or browser in our case. Take polyfills for example. How awesome would it be to just create 2 separate builds simply by passing an argument to the compiler?

Here's how:

```javascript
(function () {
    'include legacy/polyfills.js with:polyfill';
    // ... your code.
}());
```

The code inside `legacy/polyfills.js` will _only_ be included if the parameter `--with-polyfill` would be passed.

```sh
# jasce src/my_code.js --with-polyfill
```

#### Multiple conditions
It is possible to define the `with:` or `not:` argument multiple times in an include annotation, however the values may be comma-separated as well. For example:

```javascript
(function () {
    'include src/foobar.js with:foo,bar not:debug';
    // Is the same as:
    'include src/foobar.js with:foo with:bar not:debug';
}());
```

In the example above, foobar.js will __only__ be included if the arguments `--with-foo` and `--with-bar` are specified and only if `--with-debug` is __not__ passed.

### Saving the compiled source to a file

By default, the compiler simply prints the compiled code if no destination file is specified. This essentially allows you to pipe the output to another application if you want.

In order to save the compiled result to a file, you can use the `--output` parameter.

```sh
# jasce src/my_file.js --output=dist/app.js --with-polyfill
```
