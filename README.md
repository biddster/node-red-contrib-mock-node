# node-red-contrib-mock-node

Crude way of mocking node-red nodes so you can unit test them easily (ish).

## Installation

    $ npm install node-red-contrib-mock-node --save-dev

## Example

Consider the following example node:

```
module.exports = function (RED) {
    'use strict';

    RED.nodes.registerType('example-node-red-node', function (config) {

        RED.nodes.createNode(this, config);
        var node = this;

        node.context().set('test', config.testValue);
        node.context().flow.set('test', config.testValue + 1);
        node.context().global.set('test', config.testValue + 2);

        node.on('input', function (msg) {
            node.send(msg);
            node.status({
                fill: 'green',
                shape: 'dot',
                text: 'hello'
            });
        });
    });
};
```

We can test it like so:
```
var nodeRedModule = require('./example-node-red-node.js');
var mock = require('node-red-contrib-mock-node');

it('should test properly', function () {

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
```

The key part is the arguments to the function mock:

1.  This the the node red node you want to test, loaded via require.
1.  This is the config that would be passed to the node if you have pressed deploy in the node red ui.
1.  These are the credentials (http://nodered.org/docs/creating-nodes/credentials).