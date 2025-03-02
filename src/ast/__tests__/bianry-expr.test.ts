import { describe, expect, it } from "vitest";
import { BinaryExpr } from "@/ast/bianry-expr";
import { Token, TokenKind } from "@/lexer";
import { Env } from "@/ast/env";
import { NumberLiteral, BooleanLiteral, Identifier } from "@/ast/literal-expression";
import { NullLiteral } from "../node";
import { VarDeclStmt } from "../variable-declaration-stmt";
import { createBooleanLiteral, createNumberLiteral } from "@/utils/create";
import { unwrap } from "@/utils";

describe('BinaryExpr', () => {
  const createToken = (kind: TokenKind) => new Token(kind, '');
  const createEnv = () => new Env();

  it('should evaluate arithmetic expressions', () => {
    const env = createEnv();
    const lhs = new NumberLiteral(1);
    const rhs = new NumberLiteral(2);

    const plusExpr = new BinaryExpr(lhs, createToken(TokenKind.PLUS), rhs);
    expect(plusExpr.eval(env)).toEqual(new NumberLiteral(3));

    const dashExpr = new BinaryExpr(lhs, createToken(TokenKind.DASH), rhs);
    expect(dashExpr.eval(env)).toEqual(new NumberLiteral(-1));

    const starExpr = new BinaryExpr(lhs, createToken(TokenKind.STAR), rhs);
    expect(starExpr.eval(env)).toEqual(new NumberLiteral(2));

    const slashExpr = new BinaryExpr(lhs, createToken(TokenKind.SLASH), rhs);
    expect(slashExpr.eval(env)).toEqual(new NumberLiteral(0.5));

    const percentExpr = new BinaryExpr(lhs, createToken(TokenKind.PERCENT), rhs);
    expect(percentExpr.eval(env)).toEqual(new NumberLiteral(1));
  });

  it('should evaluate bitwise expressions', () => {
    const env = createEnv();
    const lhs = new NumberLiteral(1);
    const rhs = new NumberLiteral(2);

    const andExpr = new BinaryExpr(lhs, createToken(TokenKind.AND), rhs);
    expect(andExpr.eval(env)).toEqual(new NumberLiteral(0));

    const orExpr = new BinaryExpr(lhs, createToken(TokenKind.OR), rhs);
    expect(orExpr.eval(env)).toEqual(new NumberLiteral(3));
  });

  it('should evaluate comparison expressions', () => {
    const env = createEnv();
    const lhs = new NumberLiteral(1);
    const rhs = new NumberLiteral(2);

    const equalsExpr = new BinaryExpr(lhs, createToken(TokenKind.EQUALS), rhs);
    expect(equalsExpr.eval(env)).toEqual(new BooleanLiteral('false'));

    const notEqualsExpr = new BinaryExpr(lhs, createToken(TokenKind.NOT_EQUALS), rhs);
    expect(notEqualsExpr.eval(env)).toEqual(new BooleanLiteral('true'));

    const ltExpr = new BinaryExpr(lhs, createToken(TokenKind.LT), rhs);
    expect(ltExpr.eval(env)).toEqual(new BooleanLiteral('true'));

    const lteExpr = new BinaryExpr(lhs, createToken(TokenKind.LTE), rhs);
    expect(lteExpr.eval(env)).toEqual(new BooleanLiteral('true'));

    const gtExpr = new BinaryExpr(lhs, createToken(TokenKind.GT), rhs);
    expect(gtExpr.eval(env)).toEqual(new BooleanLiteral('false'));

    const gteExpr = new BinaryExpr(lhs, createToken(TokenKind.GTE), rhs);
    expect(gteExpr.eval(env)).toEqual(new BooleanLiteral('false'));
  });

  it('should evaluate logical expressions', () => {
    const env = createEnv();
    const lhs = new BooleanLiteral('true');
    const rhs = new BooleanLiteral('false');

    const andExpr = new BinaryExpr(lhs, createToken(TokenKind.LOGIC_AND), rhs);
    expect(andExpr.eval(env)).toEqual(new BooleanLiteral('false'));

    const orExpr = new BinaryExpr(lhs, createToken(TokenKind.LOGIC_OR), rhs);
    expect(orExpr.eval(env)).toEqual(new BooleanLiteral('true'));
  });

  it('should throw error for unsupported operator', () => {
    const env = createEnv();
    const lhs = new NumberLiteral(1);
    const rhs = new NumberLiteral(2);
    const unsupportedToken = new Token(TokenKind.CLOSE_BRACKET, '');

    const expr = new BinaryExpr(lhs, unsupportedToken, rhs);
    expect(() => expr.eval(env)).toThrow('Unsupport operator');
  });

  it('should throw error for invalid operand types', () => {
    const env = createEnv();
    const lhs = new BooleanLiteral('true');
    const rhs = new NumberLiteral(2);
    const plusExpr = new BinaryExpr(lhs, createToken(TokenKind.PLUS), rhs);

    expect(() => plusExpr.eval(env)).toThrow('Except NumberLiteral but found [object Object]');
  });

  it('should evaluate nested expressions', () => {
    const env = createEnv();
    const lhs = new NumberLiteral(1);
    const rhs = new NumberLiteral(2);
    const innerExpr = new BinaryExpr(lhs, createToken(TokenKind.PLUS), rhs);
    const outerExpr = new BinaryExpr(innerExpr, createToken(TokenKind.STAR), rhs);

    expect(outerExpr.eval(env)).toEqual(new NumberLiteral(6));
  });

  it('should evaluate complex logical expressions', () => {
    const env = createEnv();
    const lhs = new BooleanLiteral('true');
    const rhs = new BooleanLiteral('false');
    const innerExpr = new BinaryExpr(lhs, createToken(TokenKind.LOGIC_AND), rhs);
    const outerExpr = new BinaryExpr(innerExpr, createToken(TokenKind.LOGIC_OR), lhs);

    expect(outerExpr.eval(env)).toEqual(new BooleanLiteral('true'));
  });

  it('should throw error for invalid logical operand types', () => {
    const env = createEnv();
    const lhs = new NumberLiteral(1);
    const rhs = new BooleanLiteral('true');
    const andExpr = new BinaryExpr(lhs, createToken(TokenKind.LOGIC_AND), rhs);

    expect(() => andExpr.eval(env)).toThrow('Except BooleanLiteral but found [object Object]');
  });

  it('should evaluate mixed type expressions', () => {
    const env = createEnv();
    const lhs = new NumberLiteral(1);
    const rhs = new BooleanLiteral('true');
    const equalsExpr = new BinaryExpr(lhs, createToken(TokenKind.EQUALS), rhs);

    expect(equalsExpr.eval(env)).toEqual(new BooleanLiteral('false'));
  });

  it('should handle null literals', () => {
    const env = createEnv();
    const lhs = new NullLiteral();
    const rhs = new NullLiteral();
    const equalsExpr = new BinaryExpr(lhs, createToken(TokenKind.EQUALS), rhs);

    expect(equalsExpr.eval(env)).toEqual(new BooleanLiteral('true'));
  });

  it('MATH: should continue eval ast-node if lhs not is literal', ()=>{
    const env = createEnv();
    const x = new VarDeclStmt('x', false, createNumberLiteral(123));
    x.eval(env);
    const mathExpr = new BinaryExpr(
      new Identifier('x'),
      createToken(TokenKind.AND),
      createNumberLiteral(456)
    )
    expect(unwrap(mathExpr.eval(env))).toBe(123&456)
  })

  it('MATH: should continue eval ast-node if rhs not is literal', ()=>{
    const env = createEnv();
    const x = new VarDeclStmt('x', false, createNumberLiteral(123));
    x.eval(env);
    const mathExpr = new BinaryExpr(
      createNumberLiteral(456),
      createToken(TokenKind.AND),
      new Identifier('x'),
    )
    expect(unwrap(mathExpr.eval(env))).toBe(123&456)
  })

  it('LOGIC should continue eval ast-node if lhs not is literal', ()=>{
    const env = createEnv();
    const x = new VarDeclStmt('x', false, createBooleanLiteral(false));
    x.eval(env);
    const mathExpr = new BinaryExpr(
      new Identifier('x'),
      createToken(TokenKind.LOGIC_AND),
      createBooleanLiteral(true)
    )
    expect(unwrap(mathExpr.eval(env))).toBe(false)
  })

  it('LOGIC should continue eval ast-node if rhs not is literal', ()=>{
    const env = createEnv();
    const x = new VarDeclStmt('x', false, createBooleanLiteral(false));
    x.eval(env);
    const mathExpr = new BinaryExpr(
      createBooleanLiteral(true),
      createToken(TokenKind.LOGIC_OR),
      new Identifier('x'),
    )
    expect(unwrap(mathExpr.eval(env))).toBe(true)
  })
});