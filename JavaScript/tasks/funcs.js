'use strict';

// Emulate Asynchronous calls

function wrapAsync(callback) {
  setTimeout(callback, Math.floor((Math.random() * 1000)));
}

// Asynchronous functions

function readConfig(name, callback) {
  wrapAsync(() => {
    console.log('(1) config loaded');
    callback(null, { name });
  });
}

function selectFromDb(query, callback) {
  wrapAsync(() => {
    console.log('(2) SQL query executed');
    callback(null, [ { name: 'Kiev' }, { name: 'Roma' } ]);
  });
}

function getHttpPage(url, callback) {
  wrapAsync(() => {
    console.log('(3) Page retrieved');
    callback(null, '<html>Some archaic web here</html>');
  });
}

function readFile(path, callback) {
  wrapAsync(() => {
    console.log('(4) Readme file loaded');
    callback(null, 'file content');
  });
}

module.exports = { readConfig, selectFromDb, getHttpPage, readFile };
