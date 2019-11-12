'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var ReactDom = require("react-dom");
var ScopedModel$ReasonReactExamples = require("./ScopedModel.bs.js");

var State = {
  initial: 0
};

function initial_000(param) {
  return /* () */0;
}

function initial_001(param) {
  return /* () */0;
}

var initial = /* record */[
  initial_000,
  initial_001
];

var Action = {
  initial: initial
};

var initial$1 = /* record */[
  /* state */0,
  /* action */initial
];

var Return = {
  initial: initial$1
};

function call(param) {
  var match = React.useState((function () {
          return 0;
        }));
  var setCount = match[1];
  var increment = React.useCallback((function (param) {
          return Curry._1(setCount, (function (c) {
                        return c + 1 | 0;
                      }));
        }), /* array */[]);
  var decrement = React.useCallback((function (param) {
          return Curry._1(setCount, (function (c) {
                        return c - 1 | 0;
                      }));
        }), /* array */[]);
  return /* record */[
          /* state */match[0],
          /* action : record */[
            /* increment */increment,
            /* decrement */decrement
          ]
        ];
}

var Hook = {
  Return: Return,
  call: call
};

var CounterModel = {
  State: State,
  Action: Action,
  Hook: Hook
};

var Counter = ScopedModel$ReasonReactExamples.Make(CounterModel);

function Index$Count(Props) {
  var count = Curry._1(Counter.useState, true);
  console.log("Count");
  return React.createElement("p", undefined, String(count));
}

var Count = {
  make: Index$Count
};

function Index$Increment(Props) {
  var match = Curry._1(Counter.useAction, true);
  var increment = match[/* increment */0];
  console.log("Increment");
  return React.createElement("button", {
              onClick: (function (param) {
                  return Curry._1(increment, /* () */0);
                })
            }, "Increment");
}

var Increment = {
  make: Index$Increment
};

function Index$Decrement(Props) {
  var match = Curry._1(Counter.useAction, true);
  var decrement = match[/* decrement */1];
  console.log("Decrement");
  return React.createElement("button", {
              onClick: (function (param) {
                  return Curry._1(decrement, /* () */0);
                })
            }, "Decrement");
}

var Decrement = {
  make: Index$Decrement
};

ReactDom.render(React.createElement(Counter.Provider.make, {
          children: null
        }, React.createElement(Index$Count, { }), React.createElement(Index$Increment, { }), React.createElement(Index$Decrement, { })), document.body);

exports.CounterModel = CounterModel;
exports.Counter = Counter;
exports.Count = Count;
exports.Increment = Increment;
exports.Decrement = Decrement;
/* Counter Not a pure module */
