'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Caml_exceptions = require("bs-platform/lib/js/caml_exceptions.js");
var Utils$ReScopedModel = require("./Utils.bs.js");
var Emitter$ReScopedModel = require("./Emitter.bs.js");

var MissingScopedModelException = Caml_exceptions.create("ScopedModel-ReScopedModel.MissingScopedModelException");

var DesyncScopedModelException = Caml_exceptions.create("ScopedModel-ReScopedModel.DesyncScopedModelException");

function Make(M) {
  var context = React.createContext(undefined);
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
    var emitter = Utils$ReScopedModel.useConstant((function (param) {
            return Emitter$ReScopedModel.make(undefined);
          }));
    return React.createElement(make, makeProps(emitter, children, undefined));
  };
  var EmitterProvider = {
    make: ScopedModel$Make$EmitterProvider
  };
  var use = function (param) {
    var emitter = React.useContext(context);
    if (emitter !== undefined) {
      return emitter;
    }
    throw MissingScopedModelException;
  };
  var useValue = function (emitter) {
    var value = Curry._1(emitter.getState, undefined);
    if (value !== undefined) {
      return Caml_option.valFromOption(value);
    }
    throw DesyncScopedModelException;
  };
  var ProvidedEmitter = {
    use: use,
    useValue: useValue
  };
  var ScopedModel$Make$EmitterConsumer = function (Props) {
    var value = Props.value;
    var children = Props.children;
    var ctx = use(undefined);
    var model = Curry._1(M.call, value);
    Curry._1(ctx.sync, model);
    React.useEffect((function () {
            Curry._1(ctx.consume, model);
            
          }), /* tuple */[
          ctx,
          model
        ]);
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
    var ctx = use(undefined);
    var internalValue = useValue(ctx);
    var match = React.useState((function () {
            return Curry._1(selector, internalValue);
          }));
    var setState = match[1];
    React.useEffect((function () {
            if (!listen) {
              return ;
            }
            var callback = function (next) {
              return Curry._1(setState, (function (param) {
                            return Curry._1(selector, next);
                          }));
            };
            Curry._1(ctx.on, callback);
            return (function (param) {
                      return Curry._1(ctx.off, callback);
                    });
          }), /* tuple */[
          ctx,
          listen,
          setState
        ]);
    return match[0];
  };
  var useSelectors = function (selector, listen) {
    var ctx = use(undefined);
    var internalValue = useValue(ctx);
    var match = React.useState((function () {
            return Curry._1(selector, internalValue);
          }));
    var setState = match[1];
    React.useEffect((function () {
            if (!listen) {
              return ;
            }
            var callback = function (next) {
              var result = Curry._1(selector, next);
              var doUpdate = {
                contents: false
              };
              return Curry._1(setState, (function (prev) {
                            $$Array.iteri((function (k, v) {
                                    var nv = Caml_array.caml_array_get(result, k);
                                    if (Caml_obj.caml_notequal(nv, v)) {
                                      doUpdate.contents = true;
                                      return ;
                                    }
                                    
                                  }), prev);
                            if (doUpdate.contents) {
                              return result;
                            } else {
                              return prev;
                            }
                          }));
            };
            Curry._1(ctx.on, callback);
            return (function (param) {
                      return Curry._1(ctx.off, callback);
                    });
          }), /* tuple */[
          ctx,
          listen,
          setState
        ]);
    return match[0];
  };
  return {
          context: context,
          ContextProvider: ContextProvider,
          EmitterProvider: EmitterProvider,
          ProvidedEmitter: ProvidedEmitter,
          EmitterConsumer: EmitterConsumer,
          Provider: Provider,
          useSelector: useSelector,
          useSelectors: useSelectors
        };
}

exports.MissingScopedModelException = MissingScopedModelException;
exports.DesyncScopedModelException = DesyncScopedModelException;
exports.Make = Make;
/* react Not a pure module */
