module Listener {
  type t('a) = 'a => unit;
}

type t('a) = {
  state: ref('a),
  on: Listener.t('a) => unit,
  off: Listener.t('a) => unit,
  consume: 'a => unit,
};

let make = (initialState: 'a): t('a) => {
  let state: ref('a) = ref(initialState);
  let listeners: NativeSet.t(Listener.t('a)) = NativeSet.make();

  {
    state: state,
    on: (listener) => {
      listeners##add(listener);
    },
    off: (listener) => {
      listeners##delete(listener);
    },
    consume: (value) => {
      listeners##forEach((listener) => listener(value));
      state := value;
    },
  }
};