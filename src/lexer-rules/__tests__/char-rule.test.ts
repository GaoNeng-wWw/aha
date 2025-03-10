import { describe, expect, it } from "vitest";
import { Lexer, LexerError, Token, TokenKind } from "../../lexer";
import { charRules } from "../char-rule";
import { numberLiteralRule, spaceRule, stringLiteralRule } from "../literal";
import { identifierRule } from "../identifier";
import { commenteRule } from "../comment";

describe('Lexer - CharRule', () => {
  it('groping', () => {
    const lexer = new Lexer([...charRules, spaceRule], '[ ] [] { } {} ( ) ()');
    const tokens = lexer.run();
    expect(tokens)
      .toStrictEqual(
        [
          new Token(TokenKind.OPEN_BRACKET, '['),
          new Token(TokenKind.CLOSE_BRACKET, ']'),
          new Token(TokenKind.OPEN_BRACKET, '['),
          new Token(TokenKind.CLOSE_BRACKET, ']'),
          new Token(TokenKind.OPEN_CURLY, '{'),
          new Token(TokenKind.CLOSE_CURLY, '}'),
          new Token(TokenKind.OPEN_CURLY, '{'),
          new Token(TokenKind.CLOSE_CURLY, '}'),
          new Token(TokenKind.OPEN_PAREN, '('),
          new Token(TokenKind.CLOSE_PAREN, ')'),
          new Token(TokenKind.OPEN_PAREN, '('),
          new Token(TokenKind.CLOSE_PAREN, ')'),
          new Token(TokenKind.EOF, 'EOF'),
        ]
      )
  })
  it('equivilance', () => {
    const lexer = new Lexer([...charRules, spaceRule], '<- == != !');
    expect(
      lexer.run()
    )
      .toStrictEqual([
        new Token(TokenKind.ASSIGNMENT, '<-'),
        new Token(TokenKind.EQUALS, '=='),
        new Token(TokenKind.NOT_EQUALS, '!='),
        new Token(TokenKind.NOT, '!'),
        new Token(TokenKind.EOF, 'EOF'),
      ])
  })
  it('condition', () => {
    const lexer = new Lexer([...charRules, spaceRule], '< <= > >= <- ');
    expect(
      lexer.run()
    )
      .toStrictEqual([
        new Token(TokenKind.LT, '<'),
        new Token(TokenKind.LTE, '<='),
        new Token(TokenKind.GT, '>'),
        new Token(TokenKind.GTE, '>='),
        new Token(TokenKind.ASSIGNMENT, '<-'),
        new Token(TokenKind.EOF, 'EOF'),
      ])
  })
  it('logic', () => {
    const lexer = new Lexer([...charRules, spaceRule], '& && | ||');
    expect(
      lexer.run()
    )
      .toStrictEqual([
        new Token(TokenKind.AND, '&'),
        new Token(TokenKind.LOGIC_AND, '&&'),
        new Token(TokenKind.OR, '|'),
        new Token(TokenKind.LOGIC_OR, '||'),
        new Token(TokenKind.EOF, 'EOF'),
      ])
  })
  it('symbols', () => {
    const lexer = new Lexer([...charRules, spaceRule], '.;:,');
    expect(
      lexer.run()
    )
      .toStrictEqual([
        new Token(TokenKind.DOT, '.'),
        new Token(TokenKind.SEMI, ';'),
        new Token(TokenKind.COLON, ':'),
        new Token(TokenKind.COMMA, ','),
        new Token(TokenKind.EOF, 'EOF'),
      ])
  })
  it('math', () => {
    const lexer = new Lexer([...charRules, spaceRule], '+-*/%');
    expect(
      lexer.run()
    )
      .toStrictEqual([
        new Token(TokenKind.PLUS, '+'),
        new Token(TokenKind.DASH, '-'),
        new Token(TokenKind.STAR, '*'),
        new Token(TokenKind.SLASH, '/'),
        new Token(TokenKind.PERCENT, '%'),
        new Token(TokenKind.EOF, 'EOF'),
      ])
  })
  it('keyword', () => {
    const lexer = new Lexer([...charRules, spaceRule], 'let fn if else for while return');
    expect(
      lexer.run()
    )
      .toStrictEqual([
        new Token(TokenKind.LET, 'let'),
        new Token(TokenKind.FUNCTION, 'fn'),
        new Token(TokenKind.IF, 'if'),
        new Token(TokenKind.ELSE, 'else'),
        new Token(TokenKind.FOR, 'for'),
        new Token(TokenKind.WHILE, 'while'),
        new Token(TokenKind.RETURN, 'return'),
        new Token(TokenKind.EOF, 'EOF'),
      ])
  })
  it('decl', () => {
    const lexer = new Lexer([spaceRule, commenteRule, stringLiteralRule, numberLiteralRule, identifierRule, ...charRules], 'x <- 1');
    const tokens = lexer.run();
    expect(tokens).toStrictEqual([
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.ASSIGNMENT, '<-'),
      new Token(TokenKind.NUMBER, '1'),
      new Token(TokenKind.EOF, 'EOF'),
    ])
  })
  it('if', () => {
    const input = `
x <- 1
if (x <= 1){
  // call()
  f()
}
`
    const lexer = new Lexer([spaceRule, commenteRule, stringLiteralRule, numberLiteralRule, identifierRule, ...charRules], input);
    const tokens = lexer.run();
    expect(tokens).toStrictEqual(
      [
        new Token(TokenKind.IDENTIFIER, 'x'),
        new Token(TokenKind.ASSIGNMENT, '<-'),
        new Token(TokenKind.NUMBER, '1'),
        new Token(TokenKind.IF, 'if'),
        new Token(TokenKind.OPEN_PAREN, '('),
        new Token(TokenKind.IDENTIFIER, 'x'),
        new Token(TokenKind.LTE, '<='),
        new Token(TokenKind.NUMBER, '1'),
        new Token(TokenKind.CLOSE_PAREN, ')'),
        new Token(TokenKind.OPEN_CURLY, '{'),
        new Token(TokenKind.IDENTIFIER, 'f'),
        new Token(TokenKind.OPEN_PAREN, '('),
        new Token(TokenKind.CLOSE_PAREN, ')'),
        new Token(TokenKind.CLOSE_CURLY, '}'),
        new Token(TokenKind.EOF, 'EOF'),
      ]
    )
  })
  it('should handle edge cases with unrecognized tokens', () => {
    const input = 'let x = 10; @';
    const lexer = new Lexer([...charRules, spaceRule], input);

    expect(() => lexer.run()).toThrow(LexerError);
  });
  it('should ignore comments', () => {
    const input = '// this is a comment\nlet x <- 10;';
    const lexer = new Lexer([commenteRule, ...charRules, spaceRule, identifierRule, numberLiteralRule], input);
    const tokens = lexer.run();

    expect(tokens).toEqual([
      new Token(TokenKind.LET, 'let'),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.ASSIGNMENT, '<-'),
      new Token(TokenKind.NUMBER, '10'),
      new Token(TokenKind.SEMI, ';'),
      new Token(TokenKind.EOF, 'EOF'),
    ]);
  });
  it('should handle mixed input correctly', () => {
    const input = 'let x <- 10; if (x > 5) { x <- x + 1; }';
    const lexer = new Lexer([spaceRule, commenteRule, spaceRule, numberLiteralRule, ...charRules, identifierRule], input);
    const tokens = lexer.run();

    expect(tokens).toEqual([
      new Token(TokenKind.LET, 'let'),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.ASSIGNMENT, '<-'),
      new Token(TokenKind.NUMBER, '10'),
      new Token(TokenKind.SEMI, ';'),
      new Token(TokenKind.IF, 'if'),
      new Token(TokenKind.OPEN_PAREN, '('),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.GT, '>'),
      new Token(TokenKind.NUMBER, '5'),
      new Token(TokenKind.CLOSE_PAREN, ')'),
      new Token(TokenKind.OPEN_CURLY, '{'),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.ASSIGNMENT, '<-'),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.PLUS, '+'),
      new Token(TokenKind.NUMBER, '1'),
      new Token(TokenKind.SEMI, ';'),
      new Token(TokenKind.CLOSE_CURLY, '}'),
      new Token(TokenKind.EOF, 'EOF'),
    ]);
  });
  it('should handle const', () => {
    const input = `const x <- 10;`;
    const lexer = new Lexer([spaceRule, commenteRule, numberLiteralRule, ...charRules, identifierRule], input);
    const tokens = lexer.run();
    expect(tokens).toEqual([
      new Token(TokenKind.CONST, 'const'),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.ASSIGNMENT, '<-'),
      new Token(TokenKind.NUMBER, '10'),
      new Token(TokenKind.SEMI, ';'),
      new Token(TokenKind.EOF, 'EOF'),
    ])
  })
  it('should handle edge cases with mixed input', () => {
    const input = 'let x <- 10; // comment\nif (x > 5) { x <- x + 1; }';
    const lexer = new Lexer([spaceRule, commenteRule, numberLiteralRule, ...charRules, identifierRule], input);
    const tokens = lexer.run();

    expect(tokens).toEqual([
      new Token(TokenKind.LET, 'let'),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.ASSIGNMENT, '<-'),
      new Token(TokenKind.NUMBER, '10'),
      new Token(TokenKind.SEMI, ';'),
      new Token(TokenKind.IF, 'if'),
      new Token(TokenKind.OPEN_PAREN, '('),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.GT, '>'),
      new Token(TokenKind.NUMBER, '5'),
      new Token(TokenKind.CLOSE_PAREN, ')'),
      new Token(TokenKind.OPEN_CURLY, '{'),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.ASSIGNMENT, '<-'),
      new Token(TokenKind.IDENTIFIER, 'x'),
      new Token(TokenKind.PLUS, '+'),
      new Token(TokenKind.NUMBER, '1'),
      new Token(TokenKind.SEMI, ';'),
      new Token(TokenKind.CLOSE_CURLY, '}'),
      new Token(TokenKind.EOF, 'EOF'),
    ]);
  });
})