// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var assert = require('assert');

var immediateThis, intervalThis, timeoutThis,
    immediateArgsThis, intervalArgsThis, timeoutArgsThis;

var immediateHandler = setImmediate(function () {
  immediateThis = this;
});

var immediateArgsHandler = setImmediate(function () {
  immediateArgsThis = this;
}, "args ...");

var intervalHandler = setInterval(function () {
  clearInterval(intervalHandler);

  intervalThis = this;
}, 10);

var intervalArgsHandler = setInterval(function () {
  clearInterval(intervalArgsHandler);

  intervalArgsThis = this;
}, 0, "args ...");

var timeoutHandler = setTimeout(function () {
  timeoutThis = this;
}, 10);

var timeoutArgsHandler = setTimeout(function () {
  timeoutArgsThis = this;
}, 0, "args ...");

process.once('exit', function () {
  assert.strictEqual(immediateThis, immediateHandler);
  assert.strictEqual(immediateArgsThis, immediateArgsHandler);

  assert.strictEqual(intervalThis, intervalHandler);
  assert.strictEqual(intervalArgsThis, intervalArgsHandler);

  assert.strictEqual(timeoutThis, timeoutHandler);
  assert.strictEqual(timeoutArgsThis, timeoutArgsHandler);
});
