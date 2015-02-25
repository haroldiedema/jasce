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
(function () {

    var args    = require('minimist')(process.argv.slice(2)),
        input   = args._[0],
        output  = args.output ? args.output : null,
        program = require('path').parse(process.argv[1]).name;

    // Display help if needed.
    if (args.help === true) {

        var help = [
            'Usage: ' + program + ' <INPUT-FILE> [OPTION]...',
            'Compiles a JavaScript project into one file. Resulting source code',
            'may vary depending on given \'--with-*\' options.',
            '',
            '  -v, --verbose       Display verbose output',
            '      --output=<file> Write the compiled source to the given file.',
            '      --with-xxxx     Set include definition for the compiler. This',
            '                      argument may be passed multiple times with',
            '                      different values.',
            '',
            'For issues, please refer to https://github.com/haroldiedema/jasce/',
            ''
        ];

        console.log(help.join("\n"));
        process.exit(0);
    }

    // Make sure required arguments are passed.
    if (! input || input === '') {
        console.log('ERROR: No input file specified.');
        console.log('Try \'' + program + ' --help\' for more information.');
        process.exit(1);
    }

    // From this point on, we can do some work, providing the input file exists
    var JasCe = require('../src/JasCe.js');

    // Parse & apply arguments
    JasCe.setVerbose(args.verbose === true || args.v === true);
    JasCe.setInput(input);
    JasCe.setOutput(output);

    for (var i in args) {
        if (i.indexOf('with-') === 0) {
            JasCe.include(i.substr(5));
        }
    }

    if (source = JasCe.compile()) {
        console.log(source);
    }
}());
