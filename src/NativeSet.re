class type set('a) =
  [@bs]
  {
    pub size: int;
    pub add: 'a => unit;
    pub clear: unit => unit;
    pub delete: 'a => unit;
    pub has: 'a => bool;
    pub forEach: ('a => unit) => unit;
  };

type t('a) = Js.t(set('a));

[@bs.new] external make: unit => t('a) = "Set";