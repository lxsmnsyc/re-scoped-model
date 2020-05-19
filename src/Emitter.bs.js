'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

var Listener = { };

function make(param) {
  var state = {
    contents: undefined
  };
  var listeners = new Set();
  return {
          getState: (function (param) {
              return state.contents;
            }),
          on: (function (listener) {
              return listeners.add(listener);
            }),
          off: (function (listener) {
              return listeners.delete(listener);
            }),
          consume: (function (value) {
              state.contents = Caml_option.some(value);
              return listeners.forEach((function (listener) {
                            return Curry._1(listener, value);
                          }));
            }),
          sync: (function (value) {
              state.contents = Caml_option.some(value);
              
            })
        };
}

exports.Listener = Listener;
exports.make = make;
/* No side effect */
