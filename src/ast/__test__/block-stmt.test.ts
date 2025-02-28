import { describe, expect, it } from "vitest";
import { BlockStmt } from "../block-stmt";
import { AstStmt } from "../node";
import { Env } from "../env";

class MockStmt extends AstStmt {
  evalCalled = false;
  eval(env: Env): unknown {
    this.evalCalled = true;
    return null;
  }
}

describe('BlockStmt', () => {
  it('should initialize with a body of statements', () => {
    const stmt1 = new MockStmt();
    const stmt2 = new MockStmt();
    const blockStmt = new BlockStmt([stmt1, stmt2]);

    expect(blockStmt.body).toHaveLength(2);
    expect(blockStmt.body[0]).toBe(stmt1);
    expect(blockStmt.body[1]).toBe(stmt2);
  });

  it('should evaluate all statements in the body', () => {
    const stmt1 = new MockStmt();
    const stmt2 = new MockStmt();
    const blockStmt = new BlockStmt([stmt1, stmt2]);
    const env = new Env();

    blockStmt.eval(env);

    expect(stmt1.evalCalled).toBe(true);
    expect(stmt2.evalCalled).toBe(true);
  });
});