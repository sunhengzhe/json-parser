const Lexer = require('../utils/lex');
const Parser = require('../utils/parser');

describe('parser test', () => {
  test('parsing function', () => {
    expect(new Parser(new Lexer('{}')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('[]')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('[{}]')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('[[]]')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('[[], {}, {}]')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('"name"')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('12')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('true')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('null')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('{ "name": "aaa" }')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('{ "name": "aaa", "bbb": "ccc" }')).parsing().status).toBe(0);
    expect(new Parser(new Lexer('{ "name": "aaa", "age": 10, "other": null, "bbb": [ "kkk", { "hah": true } ] }')).parsing().status).toBe(0);
  });
});
