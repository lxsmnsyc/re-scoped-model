'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Utils$ReScopedModel = require("./Utils.bs.js");
var Emitter$ReScopedModel = require("./Emitter.bs.js");

function Make(M) {
  var context = React.createContext(Emitter$ReScopedModel.make(undefined));
  var make = context.Provider;
  var makeProps = function (value, children, param) {
    return {
            value: value,
            children: children
          };
  };
  var ContextProvider = {
    make: make,
    makeProps: makeProps
  };
  var ScopedModel$Make$EmitterProvider = function (Props) {
    var children = Props.children;
    var emitter = React.useMemo((function () {
            return Emitter$ReScopedModel.make(undefined);
          }), /* array */[]);
    return React.createElement(make, makeProps(emitter, children, /* () */0));
  };
  var EmitterProvider = {
    make: ScopedModel$Make$EmitterProvider
  };
  var ScopedModel$Make$EmitterConsumer = function (Props) {
    var value = Props.value;
    var children = Props.children;
    var ctx = React.useContext(context);
    var model = Curry._1(M.call, value);
    Curry._1(ctx[/* consume */3], Caml_option.some(model));
    return children;
  };
  var EmitterConsumer = {
    make: ScopedModel$Make$EmitterConsumer
  };
  var ScopedModel$Make$Provider = function (Props) {
    var value = Props.value;
    var children = Props.children;
    return React.createElement(ScopedModel$Make$EmitterProvider, {
                children: React.createElement(ScopedModel$Make$EmitterConsumer, {
                      value: value,
                      children: children
                    })
              });
  };
  var Provider = {
    make: ScopedModel$Make$Provider
  };
  var useSelector = function (selector, listen) {
    var ctx = React.useContext(context);
    var forceUpdate = Utils$ReScopedModel.useForceUpdate(/* () */0);
    var state = React.useMemo((function () {
            var match = ctx[/* state */0][0];
            if (match !== undefined) {
              return Caml_option.some(Curry._1(selector, Caml_option.valFromOption(match)));
            }
            
          }), /* array */[]);
    var ref = Utils$ReScopedModel.useNativeRef(state);
    var callback = React.useCallback((function (next) {
            if (next !== undefined) {
              var result = Curry._1(selector, Caml_option.valFromOption(next));
              if (Caml_obj.caml_notequal(Caml_option.some(result), ref[0])) {
                ref[0] = Caml_option.some(result);
                return Curry._1(forceUpdate, /* () */0);
              } else {
                return 0;
              }
            } else {
              return /* () */0;
            }
          }), /* array */[selector]);
    React.useEffect((function (param) {
            if (listen) {
              Curry._1(ctx[/* on */1], callback);
              return (function (param) {
                        return Curry._1(ctx[/* off */2], callback);
                      });
            }
            
          }), /* tuple */[
          ctx,
          listen,
          callback
        ]);
    return ref[0];
  };
  var useSelectors = function (selector, listen) {
    var ctx = React.useContext(context);
    var forceUpdate = Utils$ReScopedModel.useForceUpdate(/* () */0);
    var state = React.useMemo((function () {
            var match = ctx[/* state */0][0];
            if (match !== undefined) {
              return Curry._1(selector, Caml_option.valFromOption(match));
            }
            
          }), /* array */[]);
    var refs = Utils$ReScopedModel.useNativeRef(state);
    var callback = React.useCallback((function (next) {
            if (next !== undefined) {
              var result = Curry._1(selector, Caml_option.valFromOption(next));
              var doUpdate = /* record */[/* contents */false];
              var match = refs[0];
              if (match !== undefined) {
                $$Array.iteri((function (k, v) {
                        var nv = Caml_array.caml_array_get(result, k);
                        if (Caml_obj.caml_notequal(nv, v)) {
                          doUpdate[0] = true;
                          return /* () */0;
                        } else {
                          return 0;
                        }
                      }), match);
              } else {
                doUpdate[0] = true;
              }
              if (doUpdate[0]) {
                refs[0] = result;
                return Curry._1(forceUpdate, /* () */0);
              } else {
                return 0;
              }
            } else {
              return /* () */0;
            }
          }), /* array */[selector]);
    React.useEffect((function (param) {
            if (listen) {
              Curry._1(ctx[/* on */1], callback);
              return (function (param) {
                        return Curry._1(ctx[/* off */2], callback);
                      });
            }
            
          }), /* tuple */[
          ctx,
          listen,
          callback
        ]);
    return refs[0];
  };
  return {
          context: context,
          ContextProvider: ContextProvider,
          EmitterProvider: EmitterProvider,
          EmitterConsumer: EmitterConsumer,
          Provider: Provider,
          useSelector: useSelector,
          useSelectors: useSelectors
        };
}

exports.Make = Make;
/* react Not a pure module */
