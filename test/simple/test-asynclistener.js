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

var common = require('../common');
var assert = require('assert');
var net = require('net');
var fs = require('fs');
var dgram = require('dgram');
var tracing = require('tracing');

var addListener = tracing.addAsyncListener;
var removeListener = tracing.removeAsyncListener;
var actualAsync = 0;
var expectAsync = 0;

var callbacks = {
  create: function onAsync(data, type) {
    if (type !== 'NEXTTICK')
      actualAsync++;
  }
};

var listener = tracing.createAsyncListener(callbacks);

process.on('exit', function() {
  process._rawDebug('expected', expectAsync);
  process._rawDebug('actual  ', actualAsync);
  // TODO(trevnorris): Not a great test. If one was missed, but others
  // overflowed then the test would still pass.
  assert.ok(actualAsync >= expectAsync);
});


// Test listeners side-by-side
process.nextTick(function() {
  addListener(listener);

  setInterval(function() {
    clearInterval(this);
  });
  expectAsync++;

  setInterval(function() {
    clearInterval(this);
  });
  expectAsync++;

  setTimeout(function() { });
  expectAsync++;

  setTimeout(function() { });
  expectAsync++;

  setImmediate(function() { });
  expectAsync++;

  setImmediate(function() { });
  expectAsync++;

  setTimeout(function() { }, 10);
  expectAsync++;

  setTimeout(function() { }, 10);
  expectAsync++;

  removeListener(listener);
});


// Async listeners should propagate with nested callbacks
process.nextTick(function() {
  addListener(listener);
  var interval = 3;

  process.nextTick(function() {
    setTimeout(function() {
      setImmediate(function() {
        setInterval(function() {
          if (--interval <= 0)
            clearInterval(this);
        });
        expectAsync++;
      });
      expectAsync++;
      process.nextTick(function() {
        setImmediate(function() {
          setTimeout(function() { }, 20);
          expectAsync++;
        });
        expectAsync++;
      });
      expectAsync++;
    });
    expectAsync++;
  });

  removeListener(listener);
});

// Test callbacks from fs I/O
process.nextTick(function() {
  addListener(listener);

  fs.stat('something random', function(err, stat) { });
  expectAsync++;

  setTimeout(function() {
    fs.stat('random again', function(err, stat) { });
    expectAsync++;
  }, 10);
  expectAsync++;

  removeListener(listener);
});


// Test net I/O
process.nextTick(function() {
  addListener(listener);

  var server = net.createServer();

  server.listen(common.PORT, function() {
    net.connect(common.PORT, function() {
      this.destroy();
      server.close();
    });
    expectAsync++;
  });
  expectAsync++;

  removeListener(listener);
});


// Test UDP
process.nextTick(function() {
  addListener(listener);

  dgram.createSocket('udp4').close();
  expectAsync++;

  removeListener(listener);
});
