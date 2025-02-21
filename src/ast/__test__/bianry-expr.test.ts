import { describe, expect, it } from "vitest";
import { BinaryExpr } from "@/ast/bianry-expr";
import { Token, TokenKind } from "@/lexer";
import { Env } from "@/ast/env";
import { AstBooleanLiteral, AstNumberLiteral, AstSymbolExpr } from "@/ast/literal-expression";
import { createNumberLiteral, createToken, createBooleanLiteral } from "./utils";

describe('BinaryExpr', () => {

  it('Invalid Operator', ()=>{
    const expr = new BinaryExpr(
      createNumberLiteral(1),
      createToken(TokenKind.EOF),
      createNumberLiteral(2)
    );
    expect(
      ()=>expr.eval(new Env(null))
    ).toThrow()
  })

  it('AND', ()=>{
    const expr = new BinaryExpr(
      createNumberLiteral(1),
      createToken(TokenKind.AND),
      createNumberLiteral(2)
    );
    const res = expr.eval(new Env(null));
    expect(res).toBe(1 & 2)
  })
  
  it('OR', ()=>{
    const expr = new BinaryExpr(
      createNumberLiteral(1),
      createToken(TokenKind.OR),
      createNumberLiteral(2)
    );
    const res = expr.eval(new Env(null));
    expect(res).toBe(1 | 2)
  })

  it('should evaluate addition', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(1),
      createToken(TokenKind.PLUS),
      createNumberLiteral(2)
    );
    const result = expr.eval(new Env(null));
    expect(result).toBe(3);
  });

  it('should evaluate subtraction', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(5),
      createToken(TokenKind.DASH),
      createNumberLiteral(3)
    );
    const result = expr.eval(new Env(null));
    expect(result).toBe(2);
  });

  it('should evaluate multiplication', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(4),
      createToken(TokenKind.STAR),
      createNumberLiteral(3)
    );
    const result = expr.eval(new Env(null));
    expect(result).toBe(12);
  });

  it('should evaluate division', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(10),
      createToken(TokenKind.SLASH),
      createNumberLiteral(2)
    );
    const result = expr.eval(new Env(null));
    expect(result).toBe(5);
  });

  it('should evaluate modulus', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(10),
      createToken(TokenKind.PERCENT),
      createNumberLiteral(3)
    );
    const result = expr.eval(new Env(null));
    expect(result).toBe(1);
  });

  it('should not evaluate logical AND', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(1),
      createToken(TokenKind.LOGIC_AND),
      createNumberLiteral(1)
    );
    expect(()=>expr.eval(new Env(null))).toThrowError()
  });

  it('should evaluate logical AND', () => {
    const expr = new BinaryExpr(
      createBooleanLiteral(true),
      createToken(TokenKind.LOGIC_AND),
      createBooleanLiteral(true)
    );
    expect(expr.eval(new Env(null))).toBe(true);
  });

  it('should not evaluate logical OR', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(0),
      createToken(TokenKind.LOGIC_OR),
      createNumberLiteral(1)
    );
    expect(()=>expr.eval(new Env(null))).toThrowError()
  });


  it('should evaluate logical OR', () => {
    const expr = new BinaryExpr(
      createBooleanLiteral(false),
      createToken(TokenKind.LOGIC_OR),
      createBooleanLiteral(true)
    );
    expect(expr.eval(new Env(null))).toBe(true)
  });

  it('should evaluate equality', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(2),
      createToken(TokenKind.EQUALS),
      createNumberLiteral(2)
    );
    expect(expr.eval(new Env(null))).toBe(true)
  });

  it('should evaluate inequality', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(2),
      createToken(TokenKind.NOT_EQUALS),
      createNumberLiteral(3)
    );
    expect(expr.eval(new Env(null))).toBe(true);
  });

  it('should evaluate less than', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(2),
      createToken(TokenKind.LT),
      createNumberLiteral(3)
    );
    const result = expr.eval(new Env(null));
    expect(result).toBe(true);
  });

  it('should evaluate less than or equal', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(2),
      createToken(TokenKind.LTE),
      createNumberLiteral(2)
    );
    const result = expr.eval(new Env(null));
    expect(result).toBe(true);
  });

  it('should evaluate greater than', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(3),
      createToken(TokenKind.GT),
      createNumberLiteral(2)
    );
    const result = expr.eval(new Env(null));
    expect(result).toBe(true);
  });

  it('should evaluate greater than or equal', () => {
    const expr = new BinaryExpr(
      createNumberLiteral(3),
      createToken(TokenKind.GTE),
      createNumberLiteral(3)
    );
    const result = expr.eval(new Env(null));
    expect(result).toBe(true);
  });

  it('symbol', ()=>{
    const env = new Env(null);
    env.insert('x', createNumberLiteral(123));
    const s = new AstSymbolExpr('x');
    const expr = new BinaryExpr(
      s,
      createToken(TokenKind.GTE),
      createNumberLiteral(200)
    )
    const res = expr.eval(env);
    expect(res).toBe(false);
  })
});