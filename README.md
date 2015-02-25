# JasCe: JavaScript Compiler Engine

> __This project is in early development!__

JasCe (JavaScript Compiler Engine) is a JavaScript compiler that utilizes compiler-annotations, similar to the famous line `'use strict';`. The program compiles all source into one single JavaScript file which can then be minified by another program of your choice. Perhaps in the future, we'll add one of our own...

### Why would I need this?
Good question. There are several "compilers" or rather "build-tools" available already that can do the job pretty well. However, when it comes to combining multiple JavaScript files, it usually boils down to simple file concatination. That basically means that the program pastes one file after another.

With JasCe, you can perform conditional inline inclusions anywhere you want. Here's a simple example:

```javascript
// We like closures!
(function() {
    // Include this file if '--with-debug' is passed to the compiler.
    'include src/MyDebuggingTools.js with:debug';
    // Include this file if '--with-debug' is NOT passed to the compiler.
    'include src/NoDebuggingTools.js not:debug';
    
    MyDebugFunction("Hello World!");
}());
```



Imagine the files we're including contains the following:
```javascript
// MyDebuggingTools.js
var MyDebugFunction = function(msg) { console.log(msg); };

// NoDebuggingTools.js
var MyDebugFunction = function(msg) {};
```

Compiling the code above without any arguments passed to the compiler would return in the following result:
```javascript
// We like closures!
(function() {
    // Include this file if '--with-debug' is passed to the compiler.
    var MyDebugFunction = function(msg) {};
    // Include this file if '--with-debug' is NOT passed to the compiler.
    
    MyDebugFunction("Hello World!");
}());
```

Compiling with debugging:
```sh
# jasce test.js --with-debug
```
```javascript
// We like closures!
(function() {
    // Include this file if '--with-debug' is passed to the compiler.
    // Include this file if '--with-debug' is NOT passed to the compiler.
    var MyDebugFunction = function(msg) { console.log(msg); };
    
    MyDebugFunction("Hello World!");
}());
```

