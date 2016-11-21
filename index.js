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

function Context(type) {
    this._values = {};
    this._type = type;
}

Context.prototype.get = function (key) {
    return this._values[key];
};

Context.prototype.set = function (key, value) {
    console.log(this._type + ' context: set [' + key + '] => [' + value + ']');
    this._values[key] = value;
};

module.exports = function (nodeRedModule, config, credentials) {
    var _events = [], _status = undefined, _error = undefined, _sent = [], _context = new Context('node');
    _context.flow = new Context('flow');
    _context.global = new Context('global');
    var RED = {
        nodes: {
            registerType: function (nodeName, nodeConfigFunc) {
                this.nodeConfigFunc = nodeConfigFunc;
            },
            createNode: function () {
                // TODO write me
            }
        }
    };
    var node = {
        log: console.log,
        warn: console.log,
        error: function (error, msg) {
            console.log(error);
            if (error) _error = error;
            return _error;
        },
        on: function (event, eventFunc) {
            _events[event] = eventFunc;
        },
        credentials: credentials,
        emit: function (event, data) {
            _events[event](data);
        },
        status: function (status) {
            if (status) _status = status;
            return _status;
        },
        send: function (msg) {
            assert(msg);
            _sent.push(msg);
        },
        sent: function (index) {
            if (typeof index !== 'undefined') return _sent[index];
            return _sent;
        },
        context: function () {
            return _context;
        }
    };
    nodeRedModule(RED);
    RED.nodes.nodeConfigFunc.call(node, config);
    return node;
};
