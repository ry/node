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

// Flags: --enable-ssl3

var common = require('../common');
var assert = require('assert');
var tls = require('tls');
var fs = require('fs');

var SSL_Method = 'SSLv3_method';
var localhost = '127.0.0.1';

function test(honorCipherOrder, clientCipher, expectedCipher, cb) {
  var soptions = {
    secureProtocol: SSL_Method,
    key: fs.readFileSync(common.fixturesDir + '/keys/agent2-key.pem'),
    cert: fs.readFileSync(common.fixturesDir + '/keys/agent2-cert.pem'),
    ciphers: 'AES256-SHA:RC4-SHA:DES-CBC-SHA',
    honorCipherOrder: !!honorCipherOrder
  };

  var server;

  assert.doesNotThrow(function() {
    server = tls.createServer(soptions, function(cleartextStream) {
      nconns++;
    });
  }, /SSLv3 Disabled/);
}

test1();

function test1() {
  // Client has the preference of cipher suites by default
  test(false, 'DES-CBC-SHA:RC4-SHA:AES256-SHA','DES-CBC-SHA');
}
