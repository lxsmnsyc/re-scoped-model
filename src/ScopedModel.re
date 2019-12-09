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

  let call: unit => t;
};

/**
 * Creates the ScopedModel module
 */
module Make = (M: Hook) => {
  /**
   *  Create Context
   */
  let context = React.createContext(Emitter.make(None));

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
      let emitter = React.useMemo1(() => Emitter.make(None), [||]);

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

      ctx.consume(Some(model));

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

  let useSelector = (selector: M.t => 'a, listen: bool): option('a) => {
    let ctx: Emitter.t(option(M.t)) = React.useContext(context);

    let forceUpdate = Utils.useForceUpdate();

    let state = React.useMemo1(() => {
      switch (ctx.state^) {
        | Some(value) => Some(selector(value));
        | None => None;
      }
    }, [||]);

    let ref = Utils.useNativeRef(state);

    let callback = React.useCallback1((next: option(M.t)) => {
      switch (next) {
        | Some(value) => {
          let result = selector(value);

          if (Some(result) != ref^) {
            ref := Some(result);
            forceUpdate();
          }
        }
        | None => ();
      }
    }, [| selector |]);

    React.useEffect3(() => {
      if (listen) {
        ctx.on(callback);

        Some(() => ctx.off(callback));
      } else {
        None;
      }
    }, (ctx, listen, callback));

    ref^;
  };

  let useSelectors = (selector: M.t => array('a), listen: bool): option(array('a)) => {
    let ctx: Emitter.t(option(M.t)) = React.useContext(context);

    let forceUpdate = Utils.useForceUpdate();

    let state = React.useMemo1(() => {
      switch (ctx.state^) {
        | Some(value) => Some(selector(value));
        | None => None;
      }
    }, [||]);

    let refs: ref(option(array('a))) = Utils.useNativeRef(state);

    let callback = React.useCallback1((next: option(M.t)) => {
      switch (next) {
        | Some(value) => {
          let result = selector(value);

          let doUpdate: ref(bool) = ref(false);

          switch (refs^) {
            | Some(values) => {
              values |> Array.iteri((k, v) => {
                let nv = Array.get(result, k);
    
                if (nv != v) {
                  doUpdate := true;
                }
              });
            }
            | None => doUpdate := true;
          }

          if (doUpdate^) {
            refs := Some(result);
            forceUpdate();
          }
        }
        | None => ();
      }
    }, [| selector |]);

    React.useEffect3(() => {
      if (listen) {
        ctx.on(callback);

        Some(() => ctx.off(callback));
      } else {
        None;
      }
    }, (ctx, listen, callback));

    refs^;
  };
};

