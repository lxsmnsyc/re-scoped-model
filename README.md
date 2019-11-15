# @lxsmnsyc/re-scoped-model

> Scoped Model pattern in React (but with Hooks), a pure ReasonML implementation of [react-scoped-model](https://github.com/LXSMNSYC/react-scoped-model)

[![NPM](https://img.shields.io/npm/v/@lxsmnsyc/re-scoped-model.svg)](https://www.npmjs.com/package/@lxsmnsyc/re-scoped-model) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @lxsmnsyc/re-scoped-model
```

```bash
yarn add @lxsmnsyc/re-scoped-model
```

### bsconfig.json

```json
  "bs-dependencies": [
    "@lxsmnsyc/re-scoped-model"
  ],
```

## Usage

### Creating your Model

Models are created by using a hook function that is always called whenever its Provider renders, and must return an object that represents the models' state:

```reason
module CounterHook {
  /**
   * The type of our model state
   */
  type t =
    | Increment(unit => unit)
    | Decrement(unit => unit)
    | Count(int)
  ;

  /**
   * Our hook function
   * 
   * Called initial when we mount the Provide component of the generated
   * model.
   */
  let call = (): Js.Dict.t(t) => {
    let (count, setCount) = React.useState(() => 0);

    let increment = React.useCallback1(() => setCount(c => c + 1), [||]);
    let decrement = React.useCallback1(() => setCount(c => c - 1), [||]);

    /**
     * Return our model state
     */    
    Js.Dict.fromList([
      ("increment", Increment(increment)),
      ("decrement", Decrement(decrement)),
      ("count", Count(count)),
    ]);
  };
};

/**
 * Create our model
 */
module Counter = ReScopedModel.ScopedModel.Make(CounterHook);
```

### Adding to your component tree

To add the Model to your component tree, simply use the `Provider` component property:

```reason
module App {
  [@react.component]
  let make = () => 
    <Counter.Provider>
      <Count />
      <Increment />
      <Decrement />
      <Counter.Provider>
        <Count />
        <IncDec />
      </Counter.Provider>
    </Counter.Provider>
  ;
}
```

### useProperty Hook

To access the property of the provided scoped Model, you need to use the `useProperty` function from your Model instance. This function accesses the property as well as listens to the property changes, re-rendering the component.

You can also provide a boolean value to the second argument which tells the hook if it needs to listen for the changes.

```reason
module Count {
  [@react.component]
  let make = () => {
    let count = Counter.useProperty("count", true);

    Js.log("Count");

    switch (count) {
      | Some(Count(value)) => <p>{ ReasonReact.string(string_of_int(value)) }</p>;
      | _ => ReasonReact.null;
    }
  }
}
```

```reason
module Increment {
  [@react.component]
  let make = () => {
    let increment = Counter.useProperty("increment", true);

    Js.log("Increment");

    switch (increment) {
      | Some(Increment(value)) => 
        <button onClick={_ => value()}>
          { ReasonReact.string("Increment") }
        </button>;
      | _ => ReasonReact.null;
    }
  }
}
```

```reason
module Decrement {
  [@react.component]
  let make = () => {
    let decrement = Counter.useProperty("decrement", true);

    Js.log("Decrement");

    switch (decrement) {
      | Some(Decrement(value)) => 
        <button onClick={_ => value()}>
          { ReasonReact.string("Decrement") }
        </button>;
      | _ => ReasonReact.null;
    }
  }
}
```

In our Counter app, only the Count component re-renders whenever any of the Model actions are called.

To listen for multiple properties, you can use `.useProperties(keys: array(string), listen: boolean)` function, which returns the values of the properties in an array.

```reason
module IncDec {
  [@react.component]
  let make = () => {
    let [| increment, decrement |] = Counter.useProperties([| "increment", "decrement" |], true);

    Js.log("IncDec");

    <React.Fragment>
      {
        switch (increment) {
          | Some(Increment(value)) => 
            <button onClick={_ => value()}>
              { ReasonReact.string("Increment") }
            </button>;
          | _ => ReasonReact.null;
        }
      }
      {
        switch (decrement) {
          | Some(Decrement(value)) => 
            <button onClick={_ => value()}>
              { ReasonReact.string("Decrement") }
            </button>;
          | _ => ReasonReact.null;
        }
      }
    </React.Fragment>
  }
}
```

### Shadowing Context

The concept of Scoped Model is that, unlike the Global state which all components have access to the state, Scoped Models only allows access within its component tree, this is comparable as to how "global variables vs local variables" work.

However, if we use the same Provider within the same tree, the model instance will be shadowed, which is similar to how scoped-based variables in JavaScript work:

```js
let x = 10;
if (true) {
  let x = 20;
  console.log('Shadowed X: ', x); // Shadowed X: 20
}
if (true) {
  console.log('Unshadowed X: ', x); // Unshadowed X: 10
}
console.log('Same-level X:', x); // Same-level X: 10
```

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
