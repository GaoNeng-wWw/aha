import { afterEach, describe, expect, it } from "vitest";
import { Env } from "../env";
import { createProgram } from "@/utils/create";
import { unwrap } from "@/utils";
import { ObjectLiteral } from "../object-literal";
import { NumberLiteral } from "../literal-expression";
import { NullLiteral } from "../node";

describe('Member Expression', () => {
  let env = new Env();
  afterEach(() => {
    env = new Env();
  });

  it('should return 42', () => {
    const program = createProgram(`
      let obj <- {
        a: 42,
        b: {
          c: {
            d: 42
          }
        }
      };
      let x <- obj.a;
      let xx <- obj.b.c;
      let y <- xx.d;
    `);
    program.eval(env);
    expect(env.has('x')).toBe(true);
    expect(env.has('y')).toBe(true);
    expect(unwrap(env.lookup('x'))).toBe(42);
    expect(unwrap(env.lookup('y'))).toBe(42);
  });

  it('should return object literal', () => {
    const program = createProgram(`
      let obj <- {
        a: 42,
        b: {
          c: {
            d: 42
          }
        }
      };
      let a <- obj.b;
      let b <- a.c;
      let c <- b.d;
    `);
    program.eval(env);
    expect(env.has('a')).toBe(true);
    expect(env.has('b')).toBe(true);
    expect(env.has('c')).toBe(true);
    expect(env.lookup('a')).instanceOf(ObjectLiteral);
    expect(env.lookup('b')).instanceOf(ObjectLiteral);
    expect(env.lookup('c')).instanceOf(NumberLiteral);
    expect(unwrap(env.lookup('c'))).toBe(42);
  });

  it('should return function', () => {
    const program = createProgram(`
      let obj <- {
        a: 42,
        b: fn (){
          return 42;
        }
      };
      let a <- obj.b;
      let b <- a();
    `);
    program.eval(env);
    expect(env.has('a')).toBe(true);
    expect(env.lookup('b')).instanceOf(NumberLiteral);
    expect(unwrap(env.lookup('b'))).toBe(42);
  });

  it('should return null literal because it\'s not exists', () => {
    const program = createProgram(`
      let obj <- {
        a: 42,
        b: fn (){
          return 42;
        }
      };
      let a <- obj.d;
    `);
    program.eval(env);
    expect(env.has('a')).toBe(true);
    expect(env.lookup('a')).instanceOf(NullLiteral);
  });

  it('should throw error because it\'s not object literal', () => {
    const program = createProgram(`
      let arr <- [];
      let x <- arr.a;
    `);
    expect(() => program.eval(env)).toThrow();
  });

  it('should throw error because member is not object literal', () => {
    const program = createProgram(`
      let obj <- {
        a: 1,
      };
      let x <- obj.a.b;
    `);
    expect(() => program.eval(env)).toThrow();
  });

  it('should handle nested member expressions', () => {
    const program = createProgram(`
      let obj <- {
        a: {
          b: {
            c: {
              d: 42
            }
          }
        }
      };
      let x <- obj.a.b.c.d;
    `);
    program.eval(env);
    expect(env.has('x')).toBe(true);
    expect(unwrap(env.lookup('x'))).toBe(42);
  });

  it('should handle member expressions with arrays', () => {
    const program = createProgram(`
      let obj <- {
        a: [1, 2, 3]
      };
      let x <- obj.a[1];
    `);
    program.eval(env);
    expect(env.has('x')).toBe(true);
    expect(unwrap(env.lookup('x'))).toBe(2);
  });

  it('should handle member expressions with functions returning objects', () => {
    const program = createProgram(`
      let obj <- {
        a: fn () {
          let obj2 <- {
            c: 42
          };
          return obj2.c;
        }
      };
      let x <- obj.a();
    `);
    program.eval(env);
    expect(env.has('x')).toBe(true);
    expect(unwrap(env.lookup('x'))).toBe(42);
  });

  it('should handle member expressions with deeply nested functions', () => {
    const program = createProgram(`
      let obj <- {
        a: fn () {
          let obj <- {
            b: fn(){
              let obj <- {
                c: 42
              };
              return obj;
            }
          };
          return obj;
        }
      };
      let x <- obj.a().b().c;
    `);
    program.eval(env);
    expect(env.has('x')).toBe(true);
    expect(unwrap(env.lookup('x'))).toBe(42);
  });
});