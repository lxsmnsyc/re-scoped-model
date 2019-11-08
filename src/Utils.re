let useForceUpdate = () => {
  let (_, set) = React.useReducer((state, _) => !state, false);

  React.useCallback1(() => set(), [||]);
};