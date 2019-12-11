'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");

function useForceUpdate(param) {
  var match = React.useReducer((function (state, param) {
          return !state;
        }), false);
  var set = match[1];
  return React.useCallback((function (param) {
                return Curry._1(set, /* () */0);
              }), /* array */[]);
}

function useNativeRef(initial) {
  return React.useRef({
              contents: initial
            }).current;
}

exports.useForceUpdate = useForceUpdate;
exports.useNativeRef = useNativeRef;
/* react Not a pure module */
