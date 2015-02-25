/*                                                        __         _____
 JasCe - JavaScript Compiler Engine                   __ / /__ ____ / ___/__
 (C)2015, Harold Iedema <harold@iedema.me>           / // / _ `(_-</ /__/ -_)
 --------------------------------------------------- \___/\_,_/___/\___/\__/ ---
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the"Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/
module.exports = (function ()
{
    var path   = require("path"),
        colors = require("colors");

    // Compiler options
    var __extern = {},
        options  = {
        'verbose'          : false, // Show verbose output
        'input'            : null,  // Input (entry) file
        'output'           : null,  // Output file
        'include'          : [],    // Triggered using --with-*
        'annotations'      : {},    // Registered annotations
        'skip_annotations' : [],    // Annotations to skip, like 'use strict'
        'annotation_dir'   : __dirname + path.sep + 'JasCe' + path.sep + 'Annotations'
    };

    /**
     * Local verbose print function.
     *
     * @param  {string} message
     * @return void
     */
    var verbose = function(message) {
        if (! options.verbose) {
            return;
        }
        console.log('[JasCe]'.green + ': ' + message);
    };

    /**
     * Enable or disable verbose output.
     *
     * @param  is_verbose true to enable verbose output.
     * @return object
     */
    __extern.setVerbose = function(is_verbose) {
        options.verbose = is_verbose ? true : false;
        return __extern;
    };

    /**
     * Sets the input file to start parsing on.
     *
     * @param  {string} input_file
     * @return object
     */
    __extern.setInput = function(input_file) {
        options.input = input_file;
        return __extern;
    };

    /**
     * Sets the output file to write the compiled source to.
     *
     * @param  {string} output_file
     * @return object
     */
    __extern.setOutput = function(output_file) {
        options.output = output_file;
        return __extern;
    };

    /**
     * Adds an include-option.
     *
     * @param  {string} include
     * @return object
     */
    __extern.include = function(include) {
        options.include.push(include);
        return __extern;
    };

    /**
     * Instructs the compiler to skip the given annotation.
     *
     * The annotation is written in full, without quotes and in lower-case
     * characters.
     *
     * @param  {string} annotation
     * @return object
     */
    __extern.skipAnnotation = function(annotation)
    {
        options.skip_annotations.push("'" + annotation.toLowerCase() + "';");
        return __extern;
    };

    /**
     * Compiles the source.
     *
     * If no output file is specified in the options, the compiled source
     * is returned as a string.
     *
     * @return void|string
     */
    __extern.compile = function() {

        // Find annotations
        if (! options.annotations.length) {
            var fs    = require("fs"),
                files = fs.readdirSync(options.annotation_dir),
                file  = '';

            for (var i in files) {
                file = options.annotation_dir + path.sep + files[i];
                options.annotations[file] = require(file);
            }
        }

        // Fire up the compiler
        var JasCeCompiler = require('./JasCe/Compiler.js'),
            Compiler      = new JasCeCompiler(options.input, options),
            source        = Compiler.compile();

        // Write compiled source to file if an output-file has been set.
        if (typeof options.output === 'string' && options.output.trim() !== '') {
            verbose('Writing compiled source to ' + options.output);
            fs.writeFileSync(options.output, source);
            return;
        }

        // No output file has been specified. Just return the compiled source.
        return source;

    };

    // Expose API
    return __extern;
}());
