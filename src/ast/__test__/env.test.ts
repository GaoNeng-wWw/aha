import { describe, expect, it } from "vitest";
import { AstNode } from "@/ast/node";
import { Env } from "@/ast/env";

describe('Env', () => {
  class MockNode extends AstNode {}

  it('should insert and lookup a node', () => {
    const env = new Env(null);
    const node = new MockNode();
    env.insert('test', node);
    const result = env.lookup('test');
    expect(result).toBe(node);
  });

  it('should return null if node is not found', () => {
    const env = new Env(null);
    const result = env.lookup('nonexistent');
    expect(result).toBeNull();
  });

  it('should lookup in parent environment', () => {
    const parentEnv = new Env(null);
    const childEnv = new Env(parentEnv);
    const node = new MockNode();
    parentEnv.insert('test', node);
    const result = childEnv.lookup('test');
    expect(result).toBe(null);
  });

  it('should respect depth limit when looking up', () => {
    const parentEnv = new Env(null);
    const childEnv = new Env(parentEnv);
    const node = new MockNode();
    parentEnv.insert('test', node);
    const result = childEnv.lookup('test', 0);
    expect(result).toBe(node)
  });

  it('should insert and lookup multiple nodes', () => {
    const env = new Env(null);
    const node1 = new MockNode();
    const node2 = new MockNode();
    env.insert('test1', node1);
    env.insert('test2', node2);
    expect(env.lookup('test1')).toBe(node1);
    expect(env.lookup('test2')).toBe(node2);
  });
  it('should return true if node exists at current depth', () => {
    const env = new Env(null);
    const node = new MockNode();
    env.insert('test', node);
    const result = env.has('test');
    expect(result).toBe(true);
  });
  
  it('should return false if node does not exist at current depth', () => {
    const env = new Env(null);
    const result = env.has('nonexistent');
    expect(result).toBe(false);
  });
  
  it('should return true if node exists in parent environment', () => {
    const parentEnv = new Env(null);
    const childEnv = new Env(parentEnv);
    const node = new MockNode();
    parentEnv.insert('test', node);
    const result = childEnv.has('test',-1);
    expect(result).toBe(true);
  });
  
  it('should return false if node does not exist in parent environment', () => {
    const parentEnv = new Env(null);
    const childEnv = new Env(parentEnv);
    const result = childEnv.has('nonexistent');
    expect(result).toBe(false);
  });
  
  it('should respect depth limit when checking existence', () => {
    const parentEnv = new Env(null);
    const childEnv = new Env(parentEnv);
    const node = new MockNode();
    parentEnv.insert('test', node);
    const result = childEnv.has('test', 0);
    expect(result).toBe(false);
  });

  it('should return if not exists at current depth', () => {
    const parentEnv = new Env(null);
    const node = new MockNode();
    parentEnv.insert('test', node);
    expect(parentEnv.has('test')).toBe(true);
  });
});