import { LexerRule } from "../lexer";

export const commenteRule:LexerRule = [
  /^\/\/.*/,
  ({lexer,match}) =>{
    lexer.advanceN(match[0].length)
  }
]