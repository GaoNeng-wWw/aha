import { describe, expect, it } from "vitest";
import { IfStmt } from "@/ast/if-stmt";
import { Env } from "@/ast/env";
import { AstBooleanLiteral, AstNumberLiteral } from "@/ast/literal-expression";
import { AstExpr, AstStmt } from "@/ast/node";

class MockStmt extends AstStmt {
  constructor(public executed: boolean = false) {
    super();
  }
  eval(env: Env): unknown {
    this.executed = true;
    return;
  }
}

describe('IfStmt', () => {
  it('should execute the body if condition is true', () => {
    const condition = new AstBooleanLiteral('true');
    const body = new MockStmt();
    const elseBody = new MockStmt();
    const ifStmt = new IfStmt(condition, body, elseBody);
    ifStmt.eval(new Env(null));
    expect(body.executed).toBe(true);
    expect(elseBody.executed).toBe(false);
  });

  it('should execute the else body if condition is false', () => {
    const condition = new AstBooleanLiteral('false');
    const body = new MockStmt();
    const elseBody = new MockStmt();
    const ifStmt = new IfStmt(condition, body, elseBody);
    ifStmt.eval(new Env(null));
    expect(body.executed).toBe(false);
    expect(elseBody.executed).toBe(true);
  });

  it('should evaluate the condition with the given environment', () => {
    const condition = new AstNumberLiteral(1);
    const body = new MockStmt();
    const elseBody = new MockStmt();
    const ifStmt = new IfStmt(condition, body, elseBody);
    const env = new Env(null);
    ifStmt.eval(env);
    expect(body.executed).toBe(true);
    expect(elseBody.executed).toBe(false);
  });
});