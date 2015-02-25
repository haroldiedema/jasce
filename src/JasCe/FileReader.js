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
module.exports = function (file, options)
{
    // Local verbose function
    this.verbose = function(message) {
        if (! options.verbose) {
            return;
        }
        console.log('[FileReader]'.green + ': ' + message);
    };

    // Required node modules
    this.path = require("path");
    this.fs   = require("fs");

    // Gather file location information
    var file_info          = this.path.parse(file);
        file_info.relative = this.path.relative(process.cwd(), file);
        file_info.absolute = this.path.resolve(file);

    // Make sure the given file physically exists
    if (! this.fs.existsSync(file_info.absolute)) {
        throw new Error('Unable to open file "' + file + '" for reading.');
    }

    this.verbose('Prepared ' + file_info.relative.toString().yellow + ' for reading.');
    this.file = file_info;
};

/**
 * Returns the raw source of the file as a string.
 *
 * @returns string
 */
module.exports.prototype.getSource = function () {
    this.verbose('Reading raw source from ' + this.file.relative.toString().yellow + '.');
    return this.fs.readFileSync(this.file.absolute).toString();
};

/**
 * Returns the source of the file as an array separated by trimmed lines.
 *
 * @return string[]
 */
module.exports.prototype.getArraySource = function () {
    var source = this.getSource(),
        output = [];

    this.verbose('Generating and returning array-source.');

    // Normalize line-breaks and return the array result.
    return source.replace(/(\r\n)/g, "\n").split("\n");
};
