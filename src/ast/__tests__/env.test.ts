import { describe, expect, it } from "vitest";
import { AstNode } from "@/ast/node";
import { Env } from "@/ast/env";
import { NullLiteral } from "../literal-expression";

class MockNode implements AstNode {
  public name: string = 'MockNode';
  eval(env: Env): AstNode {
    return new NullLiteral();
  }
}

describe('Env', () => {
  it('should define and lookup a variable', () => {
    const env = new Env();
    const node = new MockNode();
    env.define('x', node);
    expect(env.lookup('x')).toBe(node);
  });

  it('should assign a variable', () => {
    const env = new Env();
    const node1 = new MockNode();
    const node2 = new MockNode();
    env.define('x', node1);
    env.assign('x', node2);
    expect(env.lookup('x')).toBe(node2);
  });

  it('should resolve a variable in parent environment', () => {
    const parentEnv = new Env();
    const childEnv = new Env(parentEnv);
    const node = new MockNode();
    parentEnv.define('x', node);
    expect(childEnv.lookup('x')).toBe(node);
  });

  it('should throw an error when resolving an undefined variable', () => {
    const env = new Env();
    expect(() => env.lookup('x')).toThrowError('Cannot resolve x');
  });

  it('should throw an error when assigning an undefined variable', () => {
    const env = new Env();
    const node = new MockNode();
    expect(() => env.assign('x', node)).toThrowError('Cannot resolve x');
  });
});