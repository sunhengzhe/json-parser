const {
  Token, Str, Integer, Tag, Bool, Null,
} = require('./token');

const Util = {
  isDigit(value) {
    return /\d/.test(value);
  },

  isLetter(value) {
    return /\w/.test(value);
  },

  isSpace(value) {
    return /\s/.test(value);
  },

  isLineBreak(value) {
    return /\n/.test(value);
  },

  isString(value) {
    return /[^"\\]/.test(value);
  },
};

/** Lexer */
class Lexer {
  constructor(input) {
    this.input = input;
    this.readPos = 0;
    this.line = 1;
    this.peek = ' ';
  }

  nextToken() {
    return this.input[this.readPos++]; // eslint-disable-line
  }

  scan() {
    // skip spacing
    for (;; this.peek = this.nextToken()) {
      if (Util.isLineBreak(this.peek)) {
        this.line += 1;
      } else if (Util.isSpace(this.peek)) {
        continue;
      } else if (!this.peek) {
        // 结束
        return Lexer.$;
      } else {
        break;
      }
    }

    // number
    if (Util.isDigit(this.peek)) {
      let value = 0;
      do {
        value = 10 * value + parseInt(this.peek, 10); // eslint-disable-line
        this.peek = this.nextToken();
      } while (Util.isDigit(this.peek));

      return new Integer(value);
    }

    // string
    if (this.peek === '"') {
      let str = '';
      let next = this.nextToken();
      while (next && Util.isString(next)) {
        str += next;
        next = this.nextToken();
      }

      if (next !== '"') {
        throw new SyntaxError('Unexpected end of JSON input');
      }

      this.peek = ' ';
      return new Str(str);
    }

    // boolean
    if (this.peek === 't' || this.peek === 'f') {
      if (
        this.peek === 't' &&
        this.nextToken() === 'r' &&
        this.nextToken() === 'u' &&
        this.nextToken() === 'e'
      ) {
        this.peek = ' ';
        return new Bool(1);
      }

      if (
        this.peek === 'f' &&
        this.nextToken() === 'a' &&
        this.nextToken() === 'l' &&
        this.nextToken() === 's' &&
        this.nextToken() === 'e'
      ) {
        this.peek = ' ';
        return new Bool(0);
      }
    }

    // null
    if (this.peek === 'n') {
      if (
        this.peek === 'n' &&
        this.nextToken() === 'u' &&
        this.nextToken() === 'l' &&
        this.nextToken() === 'l'
      ) {
        this.peek = ' ';
        return new Null();
      }
    }

    // others
    const tagMap = {
      ',': Tag.COMMA,
      ':': Tag.COLON,
      '[': Tag.SQUARE_OPEN,
      ']': Tag.SQUARE_CLOSE,
      '{': Tag.BLOCK_OPEN,
      '}': Tag.BLOCK_CLOSE,
    };

    if (tagMap[this.peek]) {
      const tag = tagMap[this.peek];
      this.peek = ' ';
      return new Token(tag);
    }

    throw new SyntaxError(`Unexpected token ${this.peek} in JSON at line ${this.line} position ${this.readPos}`)
  }
}

Lexer.$ = '_lexer_$';

module.exports = Lexer;
