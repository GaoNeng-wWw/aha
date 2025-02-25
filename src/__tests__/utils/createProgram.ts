import { Lexer } from "@/lexer";
import { expect } from "vitest";
import rules from '@/lexer-rules';
import { Parser } from "@/parser/parser";

export const createProgram = (input: string) => {
  const lexer = new Lexer(rules, input);
  const token = lexer.run();
  const parser = new Parser(token);
  parser.run();
  expect(parser.root).toBeDefined()
  return parser.root!;
}