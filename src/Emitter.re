module Listener {
  type t('a) = 'a => unit;
}

type t('a) = {
  getState: unit => option('a),
  on: Listener.t('a) => unit,
  off: Listener.t('a) => unit,
  consume: 'a => unit,
  sync: 'a => unit,
}

let make = (): t('a) => {
  let state: ref(option('a)) = ref(None);
  
  let listeners: NativeSet.t(Listener.t('a)) = NativeSet.make();

  {
    getState: () => state^,
    on: (listener) => {
      listeners##add(listener);
    },
    off: (listener) => {
      listeners##delete(listener);
    },
    sync: (value) => {
      state := Some(value);
    },
    consume: (value) => {
      state := Some(value);
      listeners##forEach((listener) => listener(value));
    },
  }
};