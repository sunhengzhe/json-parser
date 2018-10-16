const Lexer = require('./utils/lex');
const Parser = require('./utils/parser');

const input = process.argv[2] || '{"name": "a", "age": 10, "pets": ["dog", "cat"], "hate": null, "boy": true }';

const { status } = new Parser(new Lexer(input)).parsing();

if (status === 0) {
  console.log(`\nACCEPT! '${input}' is a valid json`);
} else {
  console.log(`\nERROR! '${input}' is not a valid json`);
}
