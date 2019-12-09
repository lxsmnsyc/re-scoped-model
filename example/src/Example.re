// Entry point

[@bs.val] external document: Js.t({..}) = "document";

module CounterHook {
  type t = {
    increment: unit => unit,
    decrement: unit => unit,
    count: int,
  };

  let call = (): t => {
    let (count, setCount) = React.useState(() => 0);

    let increment = React.useCallback1(() => setCount(c => c + 1), [||]);
    let decrement = React.useCallback1(() => setCount(c => c - 1), [||]);

    {
      increment,
      decrement,
      count,
    }
  };
};

module Counter = ReScopedModel.ScopedModel.Make(CounterHook);

module Count {
  [@react.component]
  let make = () => {
    let count = Counter.useSelector(state => state.count, true);

    Js.log("Count");

    switch (count) {
      | Some(value) => <p>{ ReasonReact.string(string_of_int(value)) }</p>;
      | _ => ReasonReact.null;
    }
  }
}

module Increment {
  [@react.component]
  let make = () => {
    let increment = Counter.useSelector(state => state.increment, true);

    Js.log("Increment");

    switch (increment) {
      | Some(value) => 
        <button onClick={_ => value()}>
          { ReasonReact.string("Increment") }
        </button>;
      | _ => ReasonReact.null;
    }
  }
}

module Decrement {
  [@react.component]
  let make = () => {
    let decrement = Counter.useSelector(state => state.decrement, true);

    Js.log("Decrement");

    switch (decrement) {
      | Some(value) => 
        <button onClick={_ => value()}>
          { ReasonReact.string("Decrement") }
        </button>;
      | _ => ReasonReact.null;
    }
  }
}

module IncDec {
  [@react.component]
  let make = () => {
    let actions = Counter.useSelector(state => {
      [|
        state.increment,
        state.decrement,
      |]
    }, true);

    Js.log("IncDec");

    switch (actions) {
      | Some([| increment, decrement |]) => 
        <React.Fragment>
          <button onClick={_ => increment()}>
            { ReasonReact.string("Increment") }
          </button>
          <button onClick={_ => decrement()}>
            { ReasonReact.string("Decrement") }
          </button>
        </React.Fragment>
      | _ => ReasonReact.null;
    }
  }
}

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

ReactDOMRe.render(
  <App />,
  document##body,
);