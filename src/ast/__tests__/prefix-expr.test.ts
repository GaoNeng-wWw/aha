import { afterEach, describe, expect, it } from "vitest";
import { PrefixExpr } from "@/ast/prefix-expr";
import { Token, TokenKind } from "@/lexer";
import { Env } from "@/ast/env";
import { BooleanLiteral, NumberLiteral, Identifier } from "@/ast/literal-expression";
import { createNumberLiteral, createProgram, createToken } from "@/utils/create";
import { unwrap } from "@/utils";

describe('PrefixExpr', () => {
  const createEnv = () => new Env();
  let env = createEnv();
  afterEach(()=>{
    env = createEnv();
  })
  it('should throw `Unknown prefix expression` error', ()=>{
    const node = new PrefixExpr(
      createToken(TokenKind.AND),
      createNumberLiteral(1)
    )
    expect(()=>node.eval(env)).toThrowError()
  })
  it('should return false', ()=>{
    const program = createProgram('let x <- !true;');
    program.eval(env);
    expect(env.has('x')).toBe(true);
    expect(env.lookup('x')).instanceOf(BooleanLiteral);
    expect(unwrap(env.lookup('x'))).toBe(false);
  })
  it('should throw error because rhs is not boolean', ()=>{
    const program = createProgram('let x <- !1;');
    expect(() => program.eval(env)).toThrowError();
  })
  it('should return -1', ()=>{
    const program = createProgram('let x <- -1;');
    program.eval(env);
    expect(env.has('x')).toBe(true);
    expect(env.lookup('x')).instanceOf(NumberLiteral);
    expect(unwrap(env.lookup('x'))).toBe(-1);
  })
  it('should throw error because rhs is not number', ()=>{
    const program = createProgram('let x <- -false;');
    expect(() => program.eval(env)).toThrowError();
  })
});