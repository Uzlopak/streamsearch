# Description

streamsearch is a module for [node.js](http://nodejs.org/) that allows searching a stream using the Boyer-Moore-Horspool algorithm.

This fork adds browser support, removes deprecation warnings, and includes a 1:1 conversion to TypeScript.

This module is based heavily on the Streaming Boyer-Moore-Horspool C++ implementation by Hongli Lai [here](https://github.com/FooBarWidget/boyer-moore-horspool).

# Installation

    npm install @vscode/streamsearch

# Example

```javascript
import StreamSearch from "@vscode/streamsearch";
import { inspect } from "util";

const needle = new Buffer([13, 10]); // CRLF
const s = new StreamSearch(needle, (isMatch, data) => {
  if (data) console.log("data: " + inspect(data.toString("ascii", start, end)));
  if (isMatch) console.log("match!");
});

const chunks = [
  new Buffer("foo"),
  new Buffer(" bar"),
  new Buffer("\r"),
  new Buffer("\n"),
  new Buffer("baz, hello\r"),
  new Buffer("\n world."),
  new Buffer("\r\n Node.JS rules!!\r\n\r\n"),
];

for (const chunk of chunks) {
  s.push(chunks[i]);
}

// output:
//
// data: 'foo'
// data: ' bar'
// match!
// data: 'baz, hello'
// match!
// data: ' world.'
// match!
// data: ' Node.JS rules!!'
// match!
// data: ''
// match!
```

# API

## Events

- **info**(< _boolean_ >isMatch[, < _Buffer_ >chunk, < _integer_ >start, < _integer_ >end]) - A match _may_ or _may not_ have been made. In either case, a preceding `chunk` of data _may_ be available that did not match the needle. Data (if available) is in `chunk` between `start` (inclusive) and `end` (exclusive).

## Properties

- **maxMatches** - < _integer_ > - The maximum number of matches. Defaults to Infinity.

- **matches** - < _integer_ > - The current match count.

## Functions

- **(constructor)**(< _mixed_ >needle) - Creates and returns a new instance for searching for a _Buffer_ or _string_ `needle`.

- **push**(< _Buffer_ >chunk) - _integer_ - Processes `chunk`. The return value is the last processed index in `chunk` + 1.

- **reset**() - _(void)_ - Resets internal state. Useful for when you wish to start searching a new/different stream for example.
