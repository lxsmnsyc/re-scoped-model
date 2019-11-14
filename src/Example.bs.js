'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var ReactDom = require("react-dom");
var Caml_builtin_exceptions = require("bs-platform/lib/js/caml_builtin_exceptions.js");
var ScopedModel$ReScopedModel = require("./ScopedModel.bs.js");

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
  return Js_dict.fromList(/* :: */[
              /* tuple */[
                "increment",
                /* Increment */Block.__(0, [increment])
              ],
              /* :: */[
                /* tuple */[
                  "decrement",
                  /* Decrement */Block.__(1, [decrement])
                ],
                /* :: */[
                  /* tuple */[
                    "count",
                    /* Count */Block.__(2, [match[0]])
                  ],
                  /* [] */0
                ]
              ]
            ]);
}

var CounterHook = {
  call: call
};

var Counter = ScopedModel$ReScopedModel.Make(CounterHook);

function Example$Count(Props) {
  var count = Curry._2(Counter.useProperty, "count", true);
  console.log("Count");
  if (count !== undefined) {
    var match = count;
    switch (match.tag | 0) {
      case /* Increment */0 :
      case /* Decrement */1 :
          return null;
      case /* Count */2 :
          return React.createElement("p", undefined, String(match[0]));
      
    }
  } else {
    return null;
  }
}

var Count = {
  make: Example$Count
};

function Example$Increment(Props) {
  var increment = Curry._2(Counter.useProperty, "increment", true);
  console.log("Increment");
  if (increment !== undefined) {
    var match = increment;
    switch (match.tag | 0) {
      case /* Increment */0 :
          var value = match[0];
          return React.createElement("button", {
                      onClick: (function (param) {
                          return Curry._1(value, /* () */0);
                        })
                    }, "Increment");
      case /* Decrement */1 :
      case /* Count */2 :
          return null;
      
    }
  } else {
    return null;
  }
}

var Increment = {
  make: Example$Increment
};

function Example$Decrement(Props) {
  var decrement = Curry._2(Counter.useProperty, "decrement", true);
  console.log("Decrement");
  if (decrement !== undefined) {
    var match = decrement;
    switch (match.tag | 0) {
      case /* Decrement */1 :
          var value = match[0];
          return React.createElement("button", {
                      onClick: (function (param) {
                          return Curry._1(value, /* () */0);
                        })
                    }, "Decrement");
      case /* Increment */0 :
      case /* Count */2 :
          return null;
      
    }
  } else {
    return null;
  }
}

var Decrement = {
  make: Example$Decrement
};

function Example$IncDec(Props) {
  var match = Curry._2(Counter.useProperties, /* array */[
        "increment",
        "decrement"
      ], true);
  if (match.length !== 2) {
    throw [
          Caml_builtin_exceptions.match_failure,
          /* tuple */[
            "Example.re",
            80,
            8
          ]
        ];
  }
  var increment = match[0];
  var decrement = match[1];
  console.log("IncDec");
  var tmp;
  if (increment !== undefined) {
    var match$1 = increment;
    switch (match$1.tag | 0) {
      case /* Increment */0 :
          var value = match$1[0];
          tmp = React.createElement("button", {
                onClick: (function (param) {
                    return Curry._1(value, /* () */0);
                  })
              }, "Increment");
          break;
      case /* Decrement */1 :
      case /* Count */2 :
          tmp = null;
          break;
      
    }
  } else {
    tmp = null;
  }
  var tmp$1;
  if (decrement !== undefined) {
    var match$2 = decrement;
    switch (match$2.tag | 0) {
      case /* Decrement */1 :
          var value$1 = match$2[0];
          tmp$1 = React.createElement("button", {
                onClick: (function (param) {
                    return Curry._1(value$1, /* () */0);
                  })
              }, "Decrement");
          break;
      case /* Increment */0 :
      case /* Count */2 :
          tmp$1 = null;
          break;
      
    }
  } else {
    tmp$1 = null;
  }
  return React.createElement(React.Fragment, {
              children: null
            }, tmp, tmp$1);
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
