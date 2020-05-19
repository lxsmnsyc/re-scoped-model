'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

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

exports.useConstant = useConstant;
/* react Not a pure module */
