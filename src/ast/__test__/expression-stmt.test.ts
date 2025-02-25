import { describe, expect, it } from "vitest";
import { ExprStmt } from "../expression-stmt";
import { AstExpr } from "../node";
import { Env } from "../env";

class MockExpr extends AstExpr {
  eval(env: Env): unknown {
    return "mocked";
  }
}

describe('ExprStmt', () => {
  it('should create an instance with the correct properties', () => {
    const expr = new MockExpr();
    const exprStmt = new ExprStmt(expr);
    expect(exprStmt.name).toBe('Expression Statement');
    expect(exprStmt.expr).toBe(expr);
  });

  it('should evaluate the expression correctly', () => {
    const expr = new MockExpr();
    const exprStmt = new ExprStmt(expr);
    const env = new Env();
    const result = exprStmt.eval(env);
    expect(result).toBe("mocked");
  });
});