'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var ReactDom = require("react-dom");
var ScopedModel$ReScopedModel = require("@lxsmnsyc/re-scoped-model/src/ScopedModel.bs.js");

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
          /* increment */increment,
          /* decrement */decrement,
          /* count */match[0]
        ];
}

var CounterHook = {
  call: call
};

var Counter = ScopedModel$ReScopedModel.Make(CounterHook);

function Example$Count(Props) {
  var count = Curry._2(Counter.useSelector, (function (state) {
          return state[/* count */2];
        }), true);
  console.log("Count");
  if (count !== undefined) {
    return React.createElement("p", undefined, String(count));
  } else {
    return null;
  }
}

var Count = {
  make: Example$Count
};

function Example$Increment(Props) {
  var increment = Curry._2(Counter.useSelector, (function (state) {
          return state[/* increment */0];
        }), true);
  console.log("Increment");
  if (increment !== undefined) {
    var value = increment;
    return React.createElement("button", {
                onClick: (function (param) {
                    return Curry._1(value, /* () */0);
                  })
              }, "Increment");
  } else {
    return null;
  }
}

var Increment = {
  make: Example$Increment
};

function Example$Decrement(Props) {
  var decrement = Curry._2(Counter.useSelector, (function (state) {
          return state[/* decrement */1];
        }), true);
  console.log("Decrement");
  if (decrement !== undefined) {
    var value = decrement;
    return React.createElement("button", {
                onClick: (function (param) {
                    return Curry._1(value, /* () */0);
                  })
              }, "Decrement");
  } else {
    return null;
  }
}

var Decrement = {
  make: Example$Decrement
};

function Example$IncDec(Props) {
  var actions = Curry._2(Counter.useSelector, (function (state) {
          return /* array */[
                  state[/* increment */0],
                  state[/* decrement */1]
                ];
        }), true);
  console.log("IncDec");
  if (actions !== undefined) {
    var match = actions;
    if (match.length !== 2) {
      return null;
    } else {
      var increment = match[0];
      var decrement = match[1];
      return React.createElement(React.Fragment, {
                  children: null
                }, React.createElement("button", {
                      onClick: (function (param) {
                          return Curry._1(increment, /* () */0);
                        })
                    }, "Increment"), React.createElement("button", {
                      onClick: (function (param) {
                          return Curry._1(decrement, /* () */0);
                        })
                    }, "Decrement"));
    }
  } else {
    return null;
  }
}

var IncDec = {
  make: Example$IncDec
};

function Example$App(Props) {
  return React.createElement(Counter.Provider.make, {
              children: null
            }, React.createElement(Example$Count, { }), React.createElement(Example$Increment, { }), React.createElement(Example$Decrement, { }), React.createElement(Counter.Provider.make, {
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
