'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Utils$ReScopedModel = require("./Utils.bs.js");
var Emitter$ReScopedModel = require("./Emitter.bs.js");

function Make(M) {
  var context = React.createContext(Emitter$ReScopedModel.make({ }));
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
            return Emitter$ReScopedModel.make({ });
          }), /* array */[]);
    return React.createElement(make, makeProps(emitter, children, /* () */0));
  };
  var EmitterProvider = {
    make: ScopedModel$Make$EmitterProvider
  };
  var ScopedModel$Make$EmitterConsumer = function (Props) {
    var children = Props.children;
    var ctx = React.useContext(context);
    var model = Curry._1(M.call, /* () */0);
    Curry._1(ctx[/* consume */3], model);
    return children;
  };
  var EmitterConsumer = {
    make: ScopedModel$Make$EmitterConsumer
  };
  var ScopedModel$Make$Provider = function (Props) {
    var children = Props.children;
    return React.createElement(ScopedModel$Make$EmitterProvider, {
                children: React.createElement(ScopedModel$Make$EmitterConsumer, {
                      children: children
                    })
              });
  };
  var Provider = {
    make: ScopedModel$Make$Provider
  };
  var useProperty = function (key, listen) {
    var ctx = React.useContext(context);
    var forceUpdate = Utils$ReScopedModel.useForceUpdate(/* () */0);
    var ref = React.useRef(Js_dict.get(ctx[/* state */0][0], key));
    var callback = React.useCallback((function (next) {
            var value = Js_dict.get(next, key);
            if (Caml_obj.caml_notequal(value, ref.current)) {
              ref.current = value;
              return Curry._1(forceUpdate, /* () */0);
            } else {
              return 0;
            }
          }), /* array */[key]);
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
    return ref.current;
  };
  var useProperties = function (keys, listen) {
    var ctx = React.useContext(context);
    var forceUpdate = Utils$ReScopedModel.useForceUpdate(/* () */0);
    var initial = React.useMemo((function () {
            return $$Array.map((function (key) {
                          return Js_dict.get(ctx[/* state */0][0], key);
                        }), keys);
          }), keys);
    var current = React.useRef(initial);
    var callback = React.useCallback((function (next) {
            var carr = current.current;
            var values = $$Array.copy(carr);
            var doUpdate = /* record */[/* contents */false];
            $$Array.iteri((function (index, item) {
                    var cv = Caml_array.caml_array_get(carr, index);
                    var nv = Js_dict.get(next, item);
                    if (Caml_obj.caml_notequal(cv, nv)) {
                      Caml_array.caml_array_set(values, index, nv);
                      doUpdate[0] = true;
                      return /* () */0;
                    } else {
                      return Caml_array.caml_array_set(values, index, cv);
                    }
                  }), keys);
            if (doUpdate[0]) {
              current.current = values;
              return Curry._1(forceUpdate, /* () */0);
            } else {
              return 0;
            }
          }), keys);
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
    return current.current;
  };
  return {
          context: context,
          ContextProvider: ContextProvider,
          EmitterProvider: EmitterProvider,
          EmitterConsumer: EmitterConsumer,
          Provider: Provider,
          useProperty: useProperty,
          useProperties: useProperties
        };
}

exports.Make = Make;
/* react Not a pure module */
