/**
 The MIT License (MIT)

 Copyright (c) 2016 @biddster

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

"use strict";
var assert = require('assert');
var nodeRedModule = require('./example-node-red-node.js');
var mock = require('../index.js');


describe('node-red-contrib-mock-node', function () {

    it('should work', function () {
        var node = mock(nodeRedModule, {
            testValue: 3
        }, {
            username: 'uname',
            password: 'pword'
        });

        assert.strictEqual(node.credentials.username, 'uname');
        assert.strictEqual(node.credentials.password, 'pword');

        assert.strictEqual(node.context().get('test'), 3);
        assert.strictEqual(node.context().flow.get('test'), 4);
        assert.strictEqual(node.context().global.get('test'), 5);

        var msg = {topic: 'topic', payload: 'payload'};
        node.emit('input', msg);
        assert.strictEqual(node.sent(0), msg);

        assert.strictEqual(node.status().fill, 'green');
        assert.strictEqual(node.status().shape, 'dot');
        assert.strictEqual(node.status().text, 'hello');
    });
});
