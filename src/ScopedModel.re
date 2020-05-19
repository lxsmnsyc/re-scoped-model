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
exception MissingScopedModelException;
exception DesyncScopedModelException;
/**
 * Type definition of a hook module
 */
module type Hook = {
  type t;

  type props;

  let call: props => t;
};

/**
 * Creates the ScopedModel module
 */
module Make = (M: Hook) => {
  /**
   *  Create Context
   */
  let context: React.Context.t(option(Emitter.t(M.t))) = React.createContext(None);

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
      let emitter = Utils.useConstant(() => Some(Emitter.make()));

      <ContextProvider value=emitter>
        children
      </ContextProvider>
    };
  }

  module ProvidedEmitter {
    let use = (): Emitter.t(M.t) => {
      let emitter = React.useContext(context);

      switch (emitter) {
        | Some(actualEmitter) => actualEmitter;
        | None => raise(MissingScopedModelException);
      }
    };

    let useValue = (emitter: Emitter.t(M.t)): M.t => {
      let value = emitter.getState();

      switch (value) {
        | Some(actualValue) => actualValue;
        | None => raise(DesyncScopedModelException);
      }
    };
  }

  /**
   * Consumes the emitter and emits the hook value
   */
  module EmitterConsumer {
    [@react.component]
    let make = (~value, ~children) => {
      let ctx = ProvidedEmitter.use();

      let model = M.call(value);

      ctx.sync(model);

      React.useEffect2(() => {
        ctx.consume(model);

        None;
      }, (ctx, model));

      children;
    };
  }

  /**
   * Component for providing the model
   */ 
  module Provider {
    [@react.component]
    let make = (~value, ~children) => {
      <EmitterProvider>
        <EmitterConsumer value>
          children
        </EmitterConsumer>
      </EmitterProvider>
    }
  }

  let useSelector = (selector: M.t => 'a, listen: bool): 'a => {
    let ctx = ProvidedEmitter.use();

    let internalValue = ProvidedEmitter.useValue(ctx);

    let (state, setState) = React.useState(() => selector(internalValue));

    React.useEffect3(() => {
      if (listen) {
        let callback = (next: M.t) => {
          setState(() => selector(next));
        };

        ctx.on(callback);

        Some(() => ctx.off(callback));
      } else {
        None;
      }
    }, (ctx, listen, setState));

    state;
  };

  let useSelectors = (selector: M.t => array('a), listen: bool): array('a) => {
    let ctx = ProvidedEmitter.use();

    let internalValue = ProvidedEmitter.useValue(ctx);

    let (state, setState) = React.useState(() => selector(internalValue));

    React.useEffect3(() => {
      if (listen) {
        let callback = (next: M.t) => {
          let result = selector(next);

          let doUpdate: ref(bool) = ref(false);

          setState((prev) => {
            prev |> Array.iteri((k, v) => {
              let nv = Array.get(result, k);
  
              if (nv != v) {
                doUpdate := true;
              }
            });

            if (doUpdate^) {
              result;
            } else {
              prev;
            }
          });
        };

        ctx.on(callback);

        Some(() => ctx.off(callback));
      } else {
        None;
      }
    }, (ctx, listen, setState));

    state;
  };
};

