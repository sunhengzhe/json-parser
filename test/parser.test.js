const Lexer = require('../utils/lex');
const Parser = require('../utils/parser');

describe('parser test', () => {
  test('parsing function', () => {
    const parser = new Parser(new Lexer('{}'));
    const { status } = parser.parsing();

    expect(status).toBe(0);
  });
});
