/** Token */
class Token {
  constructor(tag) {
    this.tag = tag;
  }
}

/** Tag */
class Tag {}
Tag.NUM = 'num';
Tag.STRING = 'str';
Tag.COMMA = ','; // ,
Tag.SQUARE_OPEN = '[';
Tag.SQUARE_CLOSE = ']';
Tag.BLOCK_OPEN = '{';
Tag.BLOCK_CLOSE = '}';
Tag.QUOTATION = '"';
Tag.COLON = ':'; // :
Tag.NULL = 'null';
Tag.BOOLEAN = 'bool';
Tag.$ = '$';

/** Integer */
class Integer extends Token {
  constructor(value) {
    super(Tag.NUM);
    this.value = value;
  }
}

/** String */
class Str extends Token {
  constructor(value) {
    super(Tag.STRING);
    this.value = value;
  }
}

class Bool extends Token {
  constructor(value) {
    super(Tag.BOOLEAN);
    this.value = value;
  }
}

class Null extends Token {
  constructor() {
    super(Tag.NULL);
  }
}

module.exports = {
  Token,
  Tag,
  Str,
  Integer,
  Bool,
  Null,
};
