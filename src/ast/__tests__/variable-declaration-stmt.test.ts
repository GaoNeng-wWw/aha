import { describe, expect, it } from "vitest";
import { Env } from "@/ast/env";
import { VarDeclStmt } from "@/ast/variable-declaration-stmt";
import { AstExpr, AstNode, NullLiteral } from "@/ast/node";

class MockExpr implements AstExpr {
  public name: string = 'MockExpr';
  eval(env: Env): AstNode {
    return new NullLiteral();
  }
}

describe('VarDeclStmt', () => {
  it('should define a variable with a literal value', () => {
    const env = new Env();
    const value = new NullLiteral();
    const stmt = new VarDeclStmt('x', false, value);
    stmt.eval(env);
    expect(env.lookup('x')).toBe(value);
  });

  it('should define a variable with an evaluated expression', () => {
    const env = new Env();
    const expr = new MockExpr();
    const stmt = new VarDeclStmt('x', false, expr);
    stmt.eval(env);
    expect(env.lookup('x')).toBeInstanceOf(NullLiteral);
  });

  it('should define a constant variable', () => {
    const env = new Env();
    const value = new NullLiteral();
    const stmt = new VarDeclStmt('x', true, value);
    stmt.eval(env);
    expect(env.lookup('x')).toBe(value);
  });

  it('should throw an error when redefining a variable', () => {
    const env = new Env();
    const value1 = new NullLiteral();
    const value2 = new NullLiteral();
    const stmt1 = new VarDeclStmt('x', false, value1);
    const stmt2 = new VarDeclStmt('x', false, value2);
    stmt1.eval(env);
    expect(() => stmt2.eval(env)).toThrowError('Variable x is already defined');
  });
});