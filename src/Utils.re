let useForceUpdate = () => {
  let (_, set) = React.useReducer((state, _) => !state, false);

  React.useCallback1(() => set(), [||]);
};

let useNativeRef = (initial) => {
  let ref = React.useRef(ref(initial));

  React.Ref.current(ref);
};