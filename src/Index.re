// Entry point

[@bs.val] external document: Js.t({..}) = "document";

module Counter = ScopedModel.Make({
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
});


// All 4 examples.

ReactDOMRe.render(
  <hr />,
  document##body,
);