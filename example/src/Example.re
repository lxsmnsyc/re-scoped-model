
[@bs.val] external document: Js.t({..}) = "document";

open ReScopedModel;

module CounterHook {
  type t = {
    increment: unit => unit,
    decrement: unit => unit,
    count: int,
  };

  type props = int;

  let call = (initial: props): t => {
    let (count, setCount) = React.useState(() => initial);

    let increment = React.useCallback0(() => setCount(c => c + 1));
    let decrement = React.useCallback0(() => setCount(c => c - 1));

    {
      increment,
      decrement,
      count,
    };
  };
}

module Counter = ScopedModel.Make(CounterHook);

module Count {
  [@react.component]
  let make = () => {
    let count: int = Counter.useSelector(state => state.count, true);

    Js.log("Count");

    <p>{ ReasonReact.string(string_of_int(count)) }</p>;
  };
}

module Increment {
  [@react.component]
  let make = () => {
    let increment: unit => unit = Counter.useSelector(state => state.increment, true);

    Js.log("Increment");

    <button onClick={_ => increment()}>
      { ReasonReact.string("Increment") }
    </button>;
  };
}

module Decrement {
  [@react.component]
  let make = () => {
    let decrement: unit => unit = Counter.useSelector(state => state.decrement, true);

    Js.log("Decrement");

    <button onClick={_ => decrement()}>
      { ReasonReact.string("Decrement") }
    </button>;
  };
}

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

ReactDOMRe.render(
  <App />,
  document##body,
);