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
  console.log(count);
  return React.createElement("hr", undefined);
}

var Count = {
  make: Index$Count
};

ReactDom.render(React.createElement(Counter.Provider.make, {
          children: React.createElement(Index$Count, { })
        }), document.body);

exports.CounterModel = CounterModel;
exports.Counter = Counter;
exports.Count = Count;
/* Counter Not a pure module */
