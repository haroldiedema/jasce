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
test('JasCe.FileReader', function(assert) {

    var FileReader = require('../../src/JasCe/FileReader.js');
    assert.equal(typeof(FileReader), 'function', 'Module loaded correctly.');

    // Test file not found error
    assert.throws(function() {
        new FileReader('i-dont-exist.txt');
    }, function(err) {
        return err.message === 'Unable to open file "i-dont-exist.txt" for reading.';
    }, 'file not found exception is thrown correctly.');

    // Test basic file reading
    var basic = new FileReader(__dirname + '/../Fixtures/FileReader/basic.js', {});
    assert.equal(basic.getSource(), '// Hello World', 'getSource returns correct value.');
    assert.deepEqual(basic.getArraySource(), ['// Hello World'], 'getArraySource returns correct value.');

    // Test multiline array source
    var multiline = new FileReader(__dirname + '/../Fixtures/FileReader/multiline.js', {});
    assert.deepEqual(multiline.getArraySource(), ['// This is', '', '// Multiline!'], 'getArraySource returns correct value (multiline).');
});
