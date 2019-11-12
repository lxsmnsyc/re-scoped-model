// Entry point

[@bs.val] external document: Js.t({..}) = "document";

module CounterModel {
  module State {
    type t = int;

    let initial = 0;
  };

  module Action {
    type t = {
      increment: unit => unit,
      decrement: unit => unit,
    };

    let initial = {
      increment: () => (),
      decrement: () => (),
    };
  };

  module Hook {
    module Return {
      type t = {
        state: State.t,
        action: Action.t,
      };

      let initial = {
        state: State.initial,
        action: Action.initial,
      };
    }

    let call = (): Return.t => {
      let (count, setCount) = React.useState(() => State.initial);

      let increment = React.useCallback1(() => setCount(c => c + 1), [||]);
      let decrement = React.useCallback1(() => setCount(c => c - 1), [||]);

      {
        state: count,
        action: {
          increment,
          decrement,
        },
      };
    };
  };
};

module Counter = ScopedModel.Make(CounterModel);

module Count {
  [@react.component]
  let make = () => {
    let count = Counter.useState(true);

    Js.log("Count");
    <p>{ ReasonReact.string(string_of_int(count)) }</p>
  }
}
module Increment {
  [@react.component]
  let make = () => {
    let { increment }: CounterModel.Action.t = Counter.useAction(true);

    Js.log("Increment");
    <button onClick={_ => increment()}>
      { ReasonReact.string("Increment") }
    </button>
  }
}
module Decrement {
  [@react.component]
  let make = () => {
    let { decrement }: CounterModel.Action.t = Counter.useAction(true);

    Js.log("Decrement");
    <button onClick={_ => decrement()}>
      { ReasonReact.string("Decrement") }
    </button>
  }
}

// All 4 examples.

ReactDOMRe.render(
  <Counter.Provider>
    <Count />
    <Increment />
    <Decrement />
  </Counter.Provider>,
  document##body,
);