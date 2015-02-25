/**
 * TestSuite Definition
 */
var testsuite = {
    code  : "./src/JasCe.js",
    tests : [
        "./test/JasCe/FileReaderTest.js",
        "./test/JasCe/Annotations/IncludeTest.js"
    ]
};

var qunit = require("qunit");
qunit.run(testsuite);
