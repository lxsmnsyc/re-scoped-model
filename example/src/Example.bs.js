'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var ReactDom = require("react-dom");
var Caml_builtin_exceptions = require("bs-platform/lib/js/caml_builtin_exceptions.js");
var ScopedModel$ReScopedModel = require("@lxsmnsyc/re-scoped-model/src/ScopedModel.bs.js");

function call(initial) {
  var match = React.useState((function () {
          return initial;
        }));
  var setCount = match[1];
  var increment = React.useCallback((function (param) {
          return Curry._1(setCount, (function (c) {
                        return c + 1 | 0;
                      }));
        }), ([]));
  var decrement = React.useCallback((function (param) {
          return Curry._1(setCount, (function (c) {
                        return c - 1 | 0;
                      }));
        }), ([]));
  return {
          increment: increment,
          decrement: decrement,
          count: match[0]
        };
}

var CounterHook = {
  call: call
};

var Counter = ScopedModel$ReScopedModel.Make(CounterHook);

function Example$Count(Props) {
  var count = Curry._2(Counter.useSelector, (function (state) {
          return state.count;
        }), true);
  console.log("Count");
  return React.createElement("p", undefined, String(count));
}

var Count = {
  make: Example$Count
};

function Example$Increment(Props) {
  var increment = Curry._2(Counter.useSelector, (function (state) {
          return state.increment;
        }), true);
  console.log("Increment");
  return React.createElement("button", {
              onClick: (function (param) {
                  return Curry._1(increment, undefined);
                })
            }, "Increment");
}

var Increment = {
  make: Example$Increment
};

function Example$Decrement(Props) {
  var decrement = Curry._2(Counter.useSelector, (function (state) {
          return state.decrement;
        }), true);
  console.log("Decrement");
  return React.createElement("button", {
              onClick: (function (param) {
                  return Curry._1(decrement, undefined);
                })
            }, "Decrement");
}

var Decrement = {
  make: Example$Decrement
};

function Example$IncDec(Props) {
  var match = Curry._2(Counter.useSelector, (function (state) {
          return [
                  state.increment,
                  state.decrement
                ];
        }), true);
  if (match.length !== 2) {
    throw [
          Caml_builtin_exceptions.match_failure,
          /* tuple */[
            "Example.re",
            71,
            8
          ]
        ];
  }
  var increment = match[0];
  var decrement = match[1];
  console.log("IncDec");
  return React.createElement(React.Fragment, {
              children: null
            }, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(increment, undefined);
                    })
                }, "Increment"), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(decrement, undefined);
                    })
                }, "Decrement"));
}

var IncDec = {
  make: Example$IncDec
};

function Example$App(Props) {
  return React.createElement(Counter.Provider.make, {
              value: 0,
              children: null
            }, React.createElement(Example$Count, { }), React.createElement(Example$Increment, { }), React.createElement(Example$Decrement, { }), React.createElement(Counter.Provider.make, {
                  value: 100,
                  children: null
                }, React.createElement(Example$Count, { }), React.createElement(Example$IncDec, { })));
}

var App = {
  make: Example$App
};

ReactDom.render(React.createElement(Example$App, { }), document.body);

exports.CounterHook = CounterHook;
exports.Counter = Counter;
exports.Count = Count;
exports.Increment = Increment;
exports.Decrement = Decrement;
exports.IncDec = IncDec;
exports.App = App;
/* Counter Not a pure module */
