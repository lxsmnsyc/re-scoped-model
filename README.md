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
  type t = {
    increment: unit => unit,
    decrement: unit => unit,
    count: int,
  };

  type props = int;

  let call = (initial: props): t => {
    let (count, setCount) = React.useState(() => initial);

    let increment = React.useCallback1(() => setCount(c => c + 1), [||]);
    let decrement = React.useCallback1(() => setCount(c => c - 1), [||]);

    {
      increment,
      decrement,
      count,
    }
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
    <Counter.Provider value=0>
      <Count />
      <Increment />
      <Decrement />
      <Counter.Provider value=100>
        <Count />
        <IncDec />
      </Counter.Provider>
    </Counter.Provider>
  ;
}
```

### useSelector Hook

To access our model's state, we can use the `useSelector` hook which accepts a function that receives the current model state, and returns a new value that is derived from the given state. This allows fine-grained and reasonable re-render for the listening component, as the component will only re-render if the transformed value changes every time the model updates.

For example, in our `Count` component, we only `select` the `count` field of our model record.

```reason
module Count {
  [@react.component]
  let make = () => {
    let count = Counter.useSelector(state => state.count, true);

    Js.log("Count");

    <p>{ ReasonReact.string(string_of_int(count)) }</p>;
  }
}
```

```reason
module Increment {
  [@react.component]
  let make = () => {
    let increment = Counter.useSelector(state => state.increment, true);

    Js.log("Increment");

    <button onClick={_ => increment()}>
      { ReasonReact.string("Increment") }
    </button>;
  }
}
```

```reason
module Decrement {
  [@react.component]
  let make = () => {
    let decrement = Counter.useSelector(state => state.decrement, true);

    Js.log("Decrement");

    <button onClick={_ => decrement()}>
      { ReasonReact.string("Decrement") }
    </button>;
  }
}
```

```reason
module IncDec {
  [@react.component]
  let make = () => {
    let (increment, decrement) = Counter.useSelector(state => (
      state.increment,
      state.decrement,
    ), true);

    Js.log("IncDec");

    <React.Fragment>
      <button onClick={_ => increment()}>
        { ReasonReact.string("Increment") }
      </button>
      <button onClick={_ => decrement()}>
        { ReasonReact.string("Decrement") }
      </button>
    </React.Fragment>
  };
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
