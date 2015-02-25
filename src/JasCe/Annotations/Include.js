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
 * Includes a file at the position of the annotation. The annotation also
 * supports conditionals; achieved using --with-*
 *
 * Files are located relatively from the file the annotation is written in.
 *
 * Syntax: include <file> <options>
 *
 *      'include src/foobar.js';
 *      'include src/debugger.js with:debug';
 *
 * @author Harold Iedema <harold@iedema.me>
 */
module.exports = function(source_file, line_number, options, data)
{
    // Extract the data from the annotation.
    var data = /^'include ([^ ]+)\s?(.+)?';$/.exec(data),
        path = require('path'),
        file = path.resolve(source_file.dir + path.sep + data[1].trim()),
        args = data[2] ? data[2].trim() : '',
        incl = options.include || [];

    // Local verbose function
    var verbose = function(message) {
        if (! options.verbose) {
            return;
        }
        console.log('[Compiler]'.green + ': ' + message);
    };

    // If arguments are passed, make sure conditions are met before including.
    if (args !== '') {
        var regex = /(\w+):\s?([^ ]+)/g, arg_data, include = [], exclude = [], x;
        while (null !== (arg_data = regex.exec(args))) {
            switch (arg_data[1].toLowerCase()) {
                case 'with':
                    x = arg_data[2].trim().split(',');
                    for (var i in x) { include.push(x[i]); }
                    break;
                case 'without':
                case 'not':
                    x = arg_data[2].trim().split(',');
                    for (var i in x) { exclude.push(x[i]); }
                    break;
                default:
                    throw new Error('Parse error in Include annotation. Unexpected argument "' + arg_data[1] + '".');
            }
        }

        if (! include.length && ! exclude.length) {
            throw new Error('Parse error in Include annotation. Unexpected argument "' + args + '".');
        }

        // Make sure all includes are present.
        for (var i in include) {
            if (options.include.indexOf(include[i]) === -1) {
                // Required include does not exist.
                verbose('Skipping ' + path.relative(process.cwd(), file).cyan + '. Missing required inclusion-flag: ' + include[i].yellow);
                return false;
            }
        }

        // Make sure excludes are not present.
        for (var i in exclude) {
            if (options.include.indexOf(exclude[i]) !== -1) {
                verbose('Skipping ' + path.relative(process.cwd(), file).cyan + '. File cannot be included while inclusion-flag "' + exclude[i].yellow + '" is present.');
                return false;
            }
        }
    }

    // Compile the source of the given file.
    var Compiler = require("../Compiler.js"),
        compiler = new Compiler(file, options, source_file);

    // Return the compiled source.
    return (compiler.compile());
};

/**
 * Returns true if the annotation accepts the given data.
 *
 * @param data
 */
module.exports.accepts = function(data) {
    return /^'include ([^ ]+)\s?(.+)?';$/.test(data);
};
