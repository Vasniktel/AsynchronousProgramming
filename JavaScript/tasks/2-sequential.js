'use strict';

// Sequential execution

const funcs = require('./funcs.js');

// Wrapper for asynchronous function
const wrapAsync = (fn, wrapper) => (...args) => {
  const cb = args.pop();
  fn(...args, (err, data) => {
    cb(err, data);
    wrapper(err, data); // callback must take care of errors
  });
};

// Once wrapper: fn will be called only one time
const once = fn => (...args) => {
  if (fn) {
    const res = fn(...args);
    fn = null;
    return res;
  }
};

// Implementation
// args: array of arrays with arguments for each function:
//   args.length === fns.length
// prepares fns for sequential execution
// returns trigger function to start execution
const sequentialAsync = (fns, args, done) => {
  const returned = new Map();
  const pars = args.slice();
  const stack = fns.map(fn => wrapAsync(fn, (err, data) => {
    returned.set(fn.name, { err, data });
    if (stack.length) stack.shift()(...pars.shift());
    else done(returned);
  }));
  return once(() => stack.shift()(...pars.shift()));
};

// Usage

// Array of functions
const fns = Object.keys(funcs).reduce((acc, fn) => {
  acc.push(funcs[fn]);
  return acc;
}, []);

// Array of arguments
const args = [
  ['myConfig', (err, data) => console.log(data)], // readConfig
  ['select * from cities', (err, data) => console.log(data)], // selectFromDb
  ['http://kpi.ua', (err, data) => console.log(data)], // getHttpPage
  ['README.md', (err, data) => console.log(data)] // readFile
];

// Call example
sequentialAsync(fns, args, ret => console.dir({ ret }, { depth: null }))();
