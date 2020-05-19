'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

function useForceUpdate(param) {
  var match = React.useReducer((function (state, param) {
          return !state;
        }), false);
  var set = match[1];
  return React.useCallback((function (param) {
                return Curry._1(set, undefined);
              }), []);
}

function useConstant(supplier) {
  var ref = React.useRef(undefined);
  var value = ref.current;
  if (value !== undefined) {
    return Caml_option.valFromOption(value);
  }
  var value$1 = Curry._1(supplier, undefined);
  ref.current = Caml_option.some(value$1);
  return value$1;
}

exports.useForceUpdate = useForceUpdate;
exports.useConstant = useConstant;
/* react Not a pure module */
