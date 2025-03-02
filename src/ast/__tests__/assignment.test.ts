import { describe, it, expect } from 'vitest';
import { Assignment } from '../assignment';
import { Env } from '../env';
import { Identifier } from '../literal-expression';
import { createNumberLiteral } from '@/utils/create';
import { NullLiteral } from '../node';
import { unwrap } from '@/utils';

describe('Assignment', () => {
  it('should assign a value to an identifier', () => {
    const env = new Env();
    env.define('x', new NullLiteral())
    const identifier = new Identifier('x');
    const value = createNumberLiteral(42)
    const assignment = new Assignment(identifier, value);

    const result = assignment.eval(env);

    expect(unwrap(result)).toBe(42);
    expect(unwrap(env.lookup('x'))).toBe(42);
  });

  it('should throw an error if identifier is not an Identifier', () => {
    const env = new Env();
    const invalidIdentifier = createNumberLiteral(42)
    const value = createNumberLiteral(42)
    const assignment = new Assignment(invalidIdentifier, value);

    expect(() => assignment.eval(env)).toThrow('Except Identifier but found Assignment');
  });

  it('should throw an error if identifier name is not a string', () => {
    const env = new Env();
    const invalidIdentifier = createNumberLiteral(42)
    const value = createNumberLiteral(42)
    const assignment = new Assignment(invalidIdentifier, value);

    expect(() => assignment.eval(env)).toThrow('Except Identifier but found Assignment');
  });

  it('should handle chained assignments', () => {
    const env = new Env();
    env.define('a', new NullLiteral());
    env.define('b', new NullLiteral());
    env.define('c', new NullLiteral());

    const identifierA = new Identifier('a');
    const valueA = createNumberLiteral(123);
    const assignmentA = new Assignment(identifierA, valueA);
    assignmentA.eval(env);

    const identifierB = new Identifier('b');
    const valueB = new Identifier('a');
    const assignmentB = new Assignment(identifierB, valueB);
    assignmentB.eval(env);

    const identifierC = new Identifier('c');
    const valueC = new Identifier('b');
    const assignmentC = new Assignment(identifierC, valueC);
    assignmentC.eval(env);

    expect(unwrap(env.lookup('a'))).toBe(123);
    expect(unwrap(env.lookup('b'))).toBe(123);
    expect(unwrap(env.lookup('c'))).toBe(123);
  });
});