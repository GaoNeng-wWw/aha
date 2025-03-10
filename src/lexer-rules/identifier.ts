import { LexerRule, Token, TokenKind } from "../lexer";

const builtinKeywordLookup: { [key: string]: TokenKind } = {
  'true': TokenKind.BOOLEAN,
  'false': TokenKind.BOOLEAN,
  'let': TokenKind.LET,
  'const': TokenKind.CONST,
  'fn': TokenKind.FUNCTION,
  'if': TokenKind.IF,
  'else': TokenKind.ELSE,
  'for': TokenKind.FOR,
  'while': TokenKind.WHILE,
  'return': TokenKind.RETURN
}

export const identifierRule: LexerRule = [
  /^[a-zA-Z_][a-zA-Z0-9_]*/,
  ({ lexer, match }) => {
    const matchValue = match[0];
    let token: Token;
    const lookupValue = matchValue in builtinKeywordLookup ? builtinKeywordLookup[matchValue] : null;
    if (lookupValue) {
      token = lexer.createToken(lookupValue, matchValue);
    } else {
      token = lexer.createToken(TokenKind.IDENTIFIER, match[0]);
    }
    lexer.push(token);
    lexer.advanceN(match[0].length);
  }
]