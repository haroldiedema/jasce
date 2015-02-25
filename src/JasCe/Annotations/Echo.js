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
 * Simple echo annotation (Example)
 *
 * Outputs the given string in the console when compiling source.
 *
 * @author Harold Iedema <harold@iedema.me>
 */
module.exports = function(file, line_number, options, data)
{
    // Extract the data from the annotation.
    var data = /^'echo "(.+)"';$/.exec(data);

    console.log(file.relative + ':' + line_number + ' => ' + data[1]);

    return '/* ' + data[1] + ' */';
};

/**
 * Returns true if the annotation accepts the given data.
 *
 * @param data
 */
module.exports.accepts = function(data) {
    return /^'echo "(.+)"';$/.test(data);
};
