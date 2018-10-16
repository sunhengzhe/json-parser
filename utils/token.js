/** Token */
class Token {
  constructor(tag) {
    this.tag = tag;
  }
}

/** Tag */
class Tag {}
Tag.NUM = 256;
Tag.STRING = 257;
Tag.COMMA = 258; // ,
Tag.SQUARE_OPEN = 259;
Tag.SQUARE_CLOSE = 260;
Tag.BLOCK_OPEN = 261;
Tag.BLOCK_CLOSE = 262;
Tag.QUOTATION = 263;
Tag.COLON = 264; // :
Tag.NULL = 265;
Tag.BOOLEAN = 267;
Tag.$ = 268;

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
