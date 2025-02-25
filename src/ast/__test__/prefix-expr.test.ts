import { beforeEach, describe, expect, it } from "vitest";
import { PrefixExpr } from "@/ast/prefix-expr";
import { TokenKind } from '@/lexer';
import { AstNumberLiteral, AstBooleanLiteral, AstSymbolExpr } from "@/ast/literal-expression";
import { Env } from "@/ast/env";
import { createNumberLiteral, createStringLiteral, createToken } from "./utils";
import { AstNode } from "../node";
import { VarDeclStmt } from "../variable-declaration-stmt";
import { FunctionDeclStmt } from "../function-declaration-stmt";
import { ReturnStatement } from "../return-statement";
import { CallExpr } from "../call-expr";

describe('PrefixExpr', () => {
  let env = new Env();
  beforeEach(()=>{
    env = new Env();
  })
  it('should evaluate negative number', () => {
    const expr = new PrefixExpr(createToken(TokenKind.DASH), new AstNumberLiteral(5));
    const result = expr.eval(env);
    expect(result).toBeInstanceOf(AstNumberLiteral);
    expect((result as AstNumberLiteral).val).toBe(-5);
  });

  it('should throw error for non-number with DASH', () => {
    const expr = new PrefixExpr(createToken(TokenKind.DASH), new AstBooleanLiteral("true"));
    expect(() => expr.eval(env)).toThrowError(`- only be used before numbers`);
  });

  it('should evaluate NOT boolean', () => {
    const expr = new PrefixExpr(createToken(TokenKind.NOT), new AstBooleanLiteral("true"));
    const result = expr.eval(env);
    expect(result).toBeInstanceOf(AstBooleanLiteral);
    expect((result as AstBooleanLiteral).val).toBe("false");
  });

  it('should throw error for non-literal with NOT', () => {
    const expr = new PrefixExpr(createToken(TokenKind.NOT), new AstNumberLiteral(5)).eval(env)
    expect(expr).instanceof(AstBooleanLiteral)
    expect(expr.eval(env)).toBe(false);
  });

  it('should throw error for non-prefix token', () => {
    const expr = new PrefixExpr(createToken(TokenKind.PLUS), new AstNumberLiteral(5));
    expect(() => expr.eval(env)).toThrowError(`plus is not prefix `);
  });

  it('should native evaluate if rhs is not ast node', ()=>{
    const expr = new PrefixExpr(createToken(TokenKind.NOT), false as unknown as AstNode);
    expect(expr.eval(env)).instanceof(AstBooleanLiteral)
  })

  it('should return -1', ()=>{
    const v1 = new VarDeclStmt('x', false, createNumberLiteral(1));
    expect(
      new PrefixExpr(createToken(TokenKind.DASH), v1).eval(env)
    )
    .instanceOf(AstNumberLiteral)
  })

  it('should return false', ()=>{
    const v1 = new VarDeclStmt('x', false, createNumberLiteral(1));
    const res = new PrefixExpr(createToken(TokenKind.NOT), v1).eval(env);

    const f = new FunctionDeclStmt(
      [],
      'f',
      [
        new ReturnStatement(
          new AstSymbolExpr('x')
        )
      ]
    )
    f.eval(env);
    const callRet = new CallExpr(new AstSymbolExpr('f'), []).eval(env);
    const r2 = new PrefixExpr(createToken(TokenKind.DASH), callRet).eval(env);
    expect(r2).instanceOf(AstNumberLiteral);
    expect(r2.eval(env)).toBe(-1)
    expect(res).instanceOf(AstBooleanLiteral)
    expect(res.eval(env)).toBe(false)
  })
});