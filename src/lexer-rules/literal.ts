import { LexerRule, TokenKind } from "../lexer";

export const stringLiteralRule:LexerRule = [
  /^"[^"]*"/,
  ({lexer,match}) =>{
    const val = match[0];
    lexer.push(
      lexer.createToken(TokenKind.STRING, val.slice(1,-1))
    );
    lexer.advanceN(val.length)
  }
];
export const spaceRule:LexerRule = [
  /^\s+/,
  ({lexer,match}) => {
    lexer.advanceN(match[0].length)
  }
]
export const numberLiteralRule:LexerRule = [
  /^[0-9]+(\.[0-9]+)?/,
  ({ lexer, match }) => {
    const val = match[0];
    lexer.push(
      lexer.createToken(TokenKind.NUMBER, val)
    );
    lexer.advanceN(val.length);
  }
]
export const booleanLiteralRule:LexerRule = [
  /^true|^false/,
  ({lexer,match}) => {
    const val = match[0];
    lexer.push(lexer.createToken(TokenKind.BOOLEAN, val));
    lexer.advanceN(val.length);
  }
]

export default [spaceRule,stringLiteralRule,numberLiteralRule,booleanLiteralRule]