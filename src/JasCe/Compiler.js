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

/**
 * FileReader
 *
 * @author Harold Iedema <harold@iedema.me>
 */
module.exports = function (file, options, parent)
{
    // Make sure the input file is specified.
    if (! file || file === null) {
        throw new Error('No input file specified.');
    }

    // Local verbose function
    this.verbose = function(message) {
        if (! options.verbose) {
            return;
        }
        console.log('[Compiler]'.green + ': ' + message);
    };

    // Load the input file and prepare the source for parsing.
    var FileReader = require("./FileReader.js");

    this.file            = new FileReader(file, options);
    this.source          = this.file.getArraySource();
    this.options         = options;
    this.parent          = parent || false;
    this.compiled_source = [];
};

/**
 * Compiles the source from the given file and returns the result.
 *
 * @return string
 */
module.exports.prototype.compile = function () {

    var line_number      = 0,
        line_trimmed     = '',
        skip_annotations = this.options.skip_annotations;

    // Find compiler annotations and handle them accordingly.
    for (var i in this.source) {

        line_trimmed            = this.source[i].trim();
        line_number             = parseInt(i) + 1;
        this.compiled_source[i] = this.source[i];

        // Find annotation on current (trimmed) line.
        if (/^'(.*)';$/.test(line_trimmed) === true) {
            // Skip known 'standard' annotations.
            if (skip_annotations.indexOf(line_trimmed.toLowerCase()) !== -1) {
                this.verbose('Skipping: ' + line_trimmed.cyan + '.');
                continue;
            }

            // Iterate over annotations until one accepts the current line.
            var a, annotation;
            for (a in this.options.annotations) {
                annotation = this.options.annotations[a];
                // Make sure the annotation is a function.
                if (typeof annotation !== 'function') {
                    continue;
                }
                // Check if the annotation accepts the current line.
                if (! annotation.accepts(line_trimmed)) {
                    continue;
                }

                var p = require("path").parse(a).name;
                this.verbose('Running annotation ' + (p.cyan) + ' at ' + (this.file.file.relative).green + ':' + (line_number).toString().green + '.');

                // Replace the current line with the result of the annotation.
                var src;
                if (false !== (src = annotation(this.file.file, line_number, this.options, line_trimmed))) {
                    this.compiled_source[i] = src;
                } else {
                    delete this.compiled_source[i];
                }
            }
        }
    }

    return this.compiled_source.join("\n");
};
