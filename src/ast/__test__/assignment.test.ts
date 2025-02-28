import { describe } from "vitest";
import { it, expect } from "vitest";
import { AstAssignment } from "../assignment";
import { AstExpr } from "../node";
import { AstSymbolExpr } from "../literal-expression";
import { Env } from "../env";

class MockExpr extends AstExpr {
  constructor(public val: unknown) {
    super();
  }
  eval(): unknown {
    return this.val;
  }
}

describe('AstAssignment', () => {
  it('should assign a value to a variable in the environment', () => {
    const env = new Env(null);
    const identifier = new AstSymbolExpr('x');
    const value = new MockExpr(42);
    const assignment = new AstAssignment(identifier, value);
    env.insert('x', null);
    assignment.eval(env);

    expect(env.lookup('x')).toBe(42);
  });
  it('should throw an error if the identifier is not an AstSymbolExpr', () => {
    const env = new Env(null);
    const invalidIdentifier = new MockExpr('invalid');
    const value = new MockExpr(42);
    const assignment = new AstAssignment(invalidIdentifier, value);

    expect(() => assignment.eval(env)).toThrow('Invalid assignment target');
  });

  it('should return the assigned value', () => {
    const env = new Env(null);
    const identifier = new AstSymbolExpr('y');
    const value = new MockExpr(100);
    const assignment = new AstAssignment(identifier, value);
    env.insert('y', null);
    const result = assignment.eval(env);

    expect(result).toBe(100);
  });

  it('should update the value of an existing variable', () => {
    const env = new Env(null);
    const identifier = new AstSymbolExpr('z');
    const initialValue = new MockExpr(10);
    const newValue = new MockExpr(20);
    const initialAssignment = new AstAssignment(identifier, initialValue);
    const newAssignment = new AstAssignment(identifier, newValue);
    env.insert('z', null);
    initialAssignment.eval(env);
    newAssignment.eval(env);

    expect(env.lookup('z')).toBe(20);
  });
});