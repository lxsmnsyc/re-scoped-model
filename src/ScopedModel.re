/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2019
 */

/**
 * Type definition of a hook module
 */
module type Hook = {
  type t;

  let call: unit => Js.Dict.t(t);
};

/**
 * Creates the ScopedModel module
 */
module Make = (M: Hook) => {
  /**
   *  Create Context
   */
  let context = React.createContext(Emitter.make(Js.Dict.empty()));

  /**
   * Wrap the Provider component
   */
  module ContextProvider {
    let make = React.Context.provider(context);

    let makeProps = (~value, ~children, ()) => {
      "value": value,
      "children": children,
    };
  }

  /**
   * A component that provides the Emitter instance
   */
  module EmitterProvider {
    [@react.component]
    let make = (~children) => {
      let emitter = React.useMemo1(() => Emitter.make(Js.Dict.empty()), [||]);

      <ContextProvider value=emitter>
        children
      </ContextProvider>
    }
  }

  /**
   * Consumes the emitter and emits the hook value
   */
  module EmitterConsumer {
    [@react.component]
    let make = (~children) => {
      let ctx = React.useContext(context);

      let model = M.call();

      ctx.consume(model);

      children
    };
  }

  /**
   * Component for providing the model
   */ 
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

  /**
   * A hook used for listening to a model's property value change.
   */
  let useProperty = (key: string, listen: bool): option(M.t) => {
    let ctx: Emitter.t(Js.Dict.t(M.t)) = React.useContext(context);

    let forceUpdate = Utils.useForceUpdate();

    let ref = React.useRef(Js.Dict.get(ctx.state^, key));

    let callback = React.useCallback1((next: Js.Dict.t(M.t)) => {
      let value = Js.Dict.get(next, key);
      if (value != React.Ref.current(ref)) {
        React.Ref.setCurrent(ref, value);
        forceUpdate();
      }
    }, [| key |]);

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

  /**
   * A hook used for listening to a model's properties changes.
   */ 
  let useProperties = (keys: array(string), listen: bool): array(option(M.t)) => {
    let ctx: Emitter.t(Js.Dict.t(M.t)) = React.useContext(context);

    let forceUpdate = Utils.useForceUpdate();

    let initial = React.useMemo1(() => {
      keys |> Array.map(key => Js.Dict.get(ctx.state^, key));
    }, keys);

    let current = React.useRef(initial);

    let callback = React.useCallback1((next: Js.Dict.t(M.t)) => {
      let carr = React.Ref.current(current);

      let values = Array.copy(carr);

      let doUpdate = ref(false);

      keys |> Array.iteri((index, item) => {
        let cv = carr->Array.get(index);
        let nv = Js.Dict.get(next, item);

        if (cv != nv) {
          Array.set(values, index, nv);
          doUpdate := true;
        } else {
          Array.set(values, index, cv);
        }
      });

      if (doUpdate^) {
        React.Ref.setCurrent(current, values);
        forceUpdate();
      }
    }, keys);

    React.useEffect3(() => {
      if (listen) {
        ctx.on(callback);

        Some(() => ctx.off(callback));
      } else {
        None;
      }
    }, (ctx, listen, callback));

    React.Ref.current(current);
  };
};

