// Entry point

[@bs.val] external document: Js.t({..}) = "document";

module CounterHook {
  type t =
    | Increment(unit => unit)
    | Decrement(unit => unit)
    | Count(int)
  ;

  let call = (): Js.Dict.t(t) => {
    let (count, setCount) = React.useState(() => 0);

    let increment = React.useCallback1(() => setCount(c => c + 1), [||]);
    let decrement = React.useCallback1(() => setCount(c => c - 1), [||]);

    
    Js.Dict.fromList([
      ("increment", Increment(increment)),
      ("decrement", Decrement(decrement)),
      ("count", Count(count)),
    ]);
  };
};

module Counter = ReScopedModel.ScopedModel.Make(CounterHook);

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