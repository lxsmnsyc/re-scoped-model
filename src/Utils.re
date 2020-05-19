let useConstant = (supplier: unit => 'a): 'a => {
  let ref: React.ref(option('a)) = React.useRef(None);

  switch (ref.current) {
    | Some(value) => value;
    | None => {
      let value = supplier();
      ref.current = Some(value);
      value;
    }
  }
};