const {
  Token, Str, Integer, Tag,
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

    // 提取数值型
    if (Util.isDigit(this.peek)) {
      let value = 0;
      do {
        value = 10 * value + parseInt(this.peek, 10); // eslint-disable-line
        this.peek = this.nextToken();
      } while (Util.isDigit(this.peek));

      return new Integer(value);
    }

    if (this.peek === '"') {
      let str = '';
      let next = this.nextToken();
      while (next && Util.isString(next)) {
        str += next;
        next = this.nextToken();
      }
      this.peek = ' ';
      return new Str(str);
    }

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

    const token = new Token(this.peek);
    this.peek = ' ';
    return token;
  }
}

Lexer.$ = '_lexer_$';

module.exports = Lexer;
