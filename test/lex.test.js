const Lexer = require('../utils/lex');
const {
  Tag, Token, Str, Integer,
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

  describe('complex test', () => {
    test('a valid input', () => {
      const lexer = new Lexer('{ "name": "abc", "age": 12, "arr": [1, "2", { "val": 3 }] }');
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
      expect(lexer.scan()).toEqual(new Token(Tag.BLOCK_CLOSE));
      expect(lexer.scan()).toEqual(Lexer.$);
    });
  });
});
