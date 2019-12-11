'use strict';

var Curry = require("bs-platform/lib/js/curry.js");

var Listener = { };

function make(initialState) {
  var state = {
    contents: initialState
  };
  var listeners = new Set();
  return {
          state: state,
          on: (function (listener) {
              return listeners.add(listener);
            }),
          off: (function (listener) {
              return listeners.delete(listener);
            }),
          consume: (function (value) {
              listeners.forEach((function (listener) {
                      return Curry._1(listener, value);
                    }));
              state.contents = value;
              return /* () */0;
            })
        };
}

exports.Listener = Listener;
exports.make = make;
/* No side effect */
