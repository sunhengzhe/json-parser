const Lexer = require('../utils/lex');
const {
  Tag, Token, Str, Integer, Bool, Null,
} = require('../utils/token');

describe('lexical analysis', () => {
  describe('should skip spacing and statistics lines', () => {
    test('skip spacing', () => {
      const lexer = new Lexer('    ');
      expect(lexer.scan()).toBe(Lexer.$);
      expect(lexer.line).toBe(1);
    });

    test('statistics lines', () => {
      const lexer = new Lexer('    \n    ');
      expect(lexer.scan()).toBe(Lexer.$);
      expect(lexer.line).toBe(2);
    });
  });

  describe('should recognize simple token', () => {
    test('recognize simple token', () => {
      const lexer = new Lexer('{}[],:');
      expect(lexer.scan().tag).toBe(Tag.BLOCK_OPEN);
      expect(lexer.scan().tag).toBe(Tag.BLOCK_CLOSE);
      expect(lexer.scan().tag).toBe(Tag.SQUARE_OPEN);
      expect(lexer.scan().tag).toBe(Tag.SQUARE_CLOSE);
      expect(lexer.scan().tag).toBe(Tag.COMMA);
      expect(lexer.scan().tag).toBe(Tag.COLON);
      expect(lexer.scan()).toBe(Lexer.$);
    });
  });

  describe('should recognize string', () => {
    test('recognize empty string', () => {
      const lexer = new Lexer('""');
      const str = lexer.scan();
      expect(str.tag).toBe(Tag.STRING);
      expect(str.value).toBe('');
      expect(lexer.scan()).toBe(Lexer.$);
    });

    test('recognize not empty string', () => {
      const lexer = new Lexer('"abc123"');
      const str = lexer.scan();
      expect(str.tag).toBe(Tag.STRING);
      expect(str.value).toBe('abc123');
      expect(lexer.scan()).toBe(Lexer.$);
    });
  });

  describe('should recognize number', () => {
    test('recognize number', () => {
      const lexer = new Lexer('123');
      const num = lexer.scan();
      expect(num.tag).toBe(Tag.NUM);
      expect(num.value).toBe(123);
      expect(lexer.scan()).toBe(Lexer.$);
    });
  });

  describe('should recognize boolean', () => {
    test('recognize true', () => {
      const lexer = new Lexer('true');
      const bool = lexer.scan();
      expect(bool.tag).toBe(Tag.BOOLEAN);
      expect(bool.value).toBe(1);
      expect(lexer.scan()).toBe(Lexer.$);
    });

    test('recognize false', () => {
      const lexer = new Lexer('false');
      const bool = lexer.scan();
      expect(bool.tag).toBe(Tag.BOOLEAN);
      expect(bool.value).toBe(0);
      expect(lexer.scan()).toBe(Lexer.$);
    });
  });

  describe('should recognize null', () => {
    test('recognize true', () => {
      const lexer = new Lexer('null');
      const bool = lexer.scan();
      expect(bool.tag).toBe(Tag.NULL);
      expect(lexer.scan()).toBe(Lexer.$);
    });
  });

  describe('should throw error with invalid input', () => {
    test('unexpected token', () => {
      const lexer = new Lexer('fase');
      expect(() => lexer.scan()).toThrowError(SyntaxError);
    });

    test('invalid string', () => {
      const lexer = new Lexer('"abc');
      expect(() => lexer.scan()).toThrowError(SyntaxError);
    });
  });

  describe('complex test', () => {
    test('a valid input', () => {
      const lexer = new Lexer('{ "name": "abc", "age": 12, "arr": [1, "2", { "val": 3 }], "is": true, "null": null }');
      expect(lexer.scan()).toEqual(new Token(Tag.BLOCK_OPEN));

      expect(lexer.scan()).toEqual(new Str('name'));
      expect(lexer.scan()).toEqual(new Token(Tag.COLON));
      expect(lexer.scan()).toEqual(new Str('abc'));
      expect(lexer.scan()).toEqual(new Token(Tag.COMMA));

      expect(lexer.scan()).toEqual(new Str('age'));
      expect(lexer.scan()).toEqual(new Token(Tag.COLON));
      expect(lexer.scan()).toEqual(new Integer(12));
      expect(lexer.scan()).toEqual(new Token(Tag.COMMA));

      expect(lexer.scan()).toEqual(new Str('arr'));
      expect(lexer.scan()).toEqual(new Token(Tag.COLON));
      expect(lexer.scan()).toEqual(new Token(Tag.SQUARE_OPEN));
      expect(lexer.scan()).toEqual(new Integer(1));
      expect(lexer.scan()).toEqual(new Token(Tag.COMMA));
      expect(lexer.scan()).toEqual(new Str('2'));
      expect(lexer.scan()).toEqual(new Token(Tag.COMMA));
      expect(lexer.scan()).toEqual(new Token(Tag.BLOCK_OPEN));
      expect(lexer.scan()).toEqual(new Str('val'));
      expect(lexer.scan()).toEqual(new Token(Tag.COLON));
      expect(lexer.scan()).toEqual(new Integer(3));
      expect(lexer.scan()).toEqual(new Token(Tag.BLOCK_CLOSE));
      expect(lexer.scan()).toEqual(new Token(Tag.SQUARE_CLOSE));
      expect(lexer.scan()).toEqual(new Token(Tag.COMMA));

      expect(lexer.scan()).toEqual(new Str('is'));
      expect(lexer.scan()).toEqual(new Token(Tag.COLON));
      expect(lexer.scan()).toEqual(new Bool(1));
      expect(lexer.scan()).toEqual(new Token(Tag.COMMA));

      expect(lexer.scan()).toEqual(new Str('null'));
      expect(lexer.scan()).toEqual(new Token(Tag.COLON));
      expect(lexer.scan()).toEqual(new Null());

      expect(lexer.scan()).toEqual(new Token(Tag.BLOCK_CLOSE));
      expect(lexer.scan()).toEqual(Lexer.$);
    });
  });
});
