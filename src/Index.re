// Entry point

[@bs.val] external document: Js.t({..}) = "document";

module CounterModel: ScopedModel.Model {
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
    let count: CounterModel.State.t = Counter.useState(true);

    Js.log(count);

    <hr />
  }
}

// All 4 examples.

ReactDOMRe.render(
  <Counter.Provider>
    <Count />
  </Counter.Provider>,
  document##body,
);