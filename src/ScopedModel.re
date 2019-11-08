/**
 * Model module type definition
 */
module type Model = {
  /**
   * Model State type definition
   */
  module State {
    type t;
    
    /**
     *  Default value for the State
     */
    let initial: t;
  };

  /**
   *  Model action type definition
   */ 
  module Action {
    /**
     *
     */
    type t;

    let initial: t;
  };

  /**
   * Model hook type definition
   */
  module Hook {
    module Return {
      type t = {
        state: State.t,
        action: Action.t,
      };

      let initial: t;
    };

    let call: unit => Return.t;
  };
};


module Make = (M: Model) => {
  /**
   *  Create Context
   */
  let context = React.createContext(Emitter.make(M.Hook.Return.initial));

  module ContextProvider {
    let make = React.Context.provider(context);

    let makeProps = (~value, ~children, ()) => {
      "value": value,
      "children": children,
    };
  }

  module EmitterProvider {
    [@react.component]
    let make = (~children) => {
      let emitter = React.useMemo1(() => Emitter.make(M.Hook.Return.initial), [||]);

      <ContextProvider value=emitter>
        children
      </ContextProvider>
    }
  }

  module EmitterConsumer {
    [@react.component]
    let make = (~children) => {
      let ctx = React.useContext(context);

      let model = M.Hook.call();

      ctx.consume(model);

      children
    };
  }

  module Provider {
    [@react.component]
    let make = (~children) => {
      <EmitterProvider>
        <EmitterConsumer>
          children
        </EmitterConsumer>
      </EmitterProvider>
    }
  }

  let useState = (listen: bool) => {
    let ctx: Emitter.t(M.Hook.Return.t) = React.useContext(context);

    let forceUpdate = Utils.useForceUpdate();

    let ref = React.useRef(ctx.state^.state);

    React.Ref.setCurrent(ref, ctx.state^.state);

    let callback = React.useCallback1((next: M.Hook.Return.t) => {
      if (next.state == React.Ref.current(ref)) {
        React.Ref.setCurrent(ref, next.state);

        forceUpdate();
      }
    }, [||]);

    React.useEffect3(() => {
      if (listen) {
        ctx.on(callback);

        Some(() => ctx.off(callback));
      } else {
        None;
      }
    }, (ctx, listen, callback));

    React.Ref.current(ref);
  };
}