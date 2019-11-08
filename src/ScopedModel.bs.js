'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Utils$ReasonReactExamples = require("./Utils.bs.js");
var Emitter$ReasonReactExamples = require("./Emitter.bs.js");

function Make(M) {
  var context = React.createContext(Emitter$ReasonReactExamples.make(M.Hook.Return.initial));
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
            return Emitter$ReasonReactExamples.make(M.Hook.Return.initial);
          }), /* array */[]);
    return React.createElement(make, makeProps(emitter, children, /* () */0));
  };
  var EmitterProvider = {
    make: ScopedModel$Make$EmitterProvider
  };
  var ScopedModel$Make$EmitterConsumer = function (Props) {
    var children = Props.children;
    var ctx = React.useContext(context);
    var model = Curry._1(M.Hook.call, /* () */0);
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
  var useState = function (listen) {
    var ctx = React.useContext(context);
    var forceUpdate = Utils$ReasonReactExamples.useForceUpdate(/* () */0);
    var ref = React.useRef(ctx[/* state */0][0][/* state */0]);
    ref.current = ctx[/* state */0][0][/* state */0];
    var callback = React.useCallback((function (next) {
            if (Caml_obj.caml_equal(next[/* state */0], ref.current)) {
              ref.current = next[/* state */0];
              return Curry._1(forceUpdate, /* () */0);
            } else {
              return 0;
            }
          }), /* array */[]);
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
  var useAction = function (listen) {
    var ctx = React.useContext(context);
    var forceUpdate = Utils$ReasonReactExamples.useForceUpdate(/* () */0);
    var ref = React.useRef(ctx[/* state */0][0][/* action */1]);
    ref.current = ctx[/* state */0][0][/* action */1];
    var callback = React.useCallback((function (next) {
            if (Caml_obj.caml_equal(next[/* action */1], ref.current)) {
              ref.current = next[/* action */1];
              return Curry._1(forceUpdate, /* () */0);
            } else {
              return 0;
            }
          }), /* array */[]);
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
  return {
          context: context,
          ContextProvider: ContextProvider,
          EmitterProvider: EmitterProvider,
          EmitterConsumer: EmitterConsumer,
          Provider: Provider,
          useState: useState,
          useAction: useAction
        };
}

exports.Make = Make;
/* react Not a pure module */
