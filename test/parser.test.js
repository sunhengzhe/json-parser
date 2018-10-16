const Lexer = require('../utils/lex');
const Parser = require('../utils/parser');

describe('parser test', () => {
  test('parsing function', () => {
    expect(new Parser(new Lexer('{}')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('[]')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('[{}]')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('[[]]')).parsing().status).toBe(0);
  });
});
