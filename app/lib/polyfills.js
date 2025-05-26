// This file sets up polyfills for Node.js modules that aren't available in React Native

// Polyfill for readable-stream (used by some Node.js modules)
if (typeof global.Buffer === 'undefined') {
  global.Buffer = require('buffer/').Buffer;
}

export default { Buffer };