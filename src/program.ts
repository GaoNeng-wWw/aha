import { Env } from "./ast/env";
import { Lexer, LexerRule } from "./lexer";
import lexerRules from "./lexer-rules";
import { Parser } from "./parser/parser";


export const createProgram = (
  code: string,
  rules: LexerRule[]=lexerRules,
  env = new Env()
) => {
  const lexer = new Lexer(rules, code);
  const tokens = lexer.run();
  const parser = new Parser(tokens);
  const block = parser.run();
  return block.eval(env);
}
