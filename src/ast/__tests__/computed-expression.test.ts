import { afterEach, describe, expect, it } from "vitest";
import { Env } from "../env";
import { createProgram } from "@/utils/create";
import { ArrayLiteral, NumberLiteral, StringLiteral } from "../literal-expression";
import { NullLiteral } from "../node";
import { unwrap } from "@/utils";
import { ObjectLiteral } from "../object-literal";

describe('Computed Expression', () => {
  let env = new Env();
  describe('Array Literal', () => {
    afterEach(() => {
      env = new Env();
    })
    it('should return number', ()=>{
      const program = createProgram(`
        let a <- 4;
        let arr <- [1,[1,2,3],a, {}];
        let x <- arr[0];
        let x1 <- arr[1];
        let x2 <- arr[2];
        let x3 <- arr[3];
        a <- 5;
      `)
      program.eval(env);
      expect(unwrap<number>(env.lookup('x'))).toBe(1);
      expect(env.lookup('x1')).instanceOf(ArrayLiteral)
      expect(unwrap<NumberLiteral>(env.lookup('x2'))).toBe(4)
      expect(env.lookup('x3')).instanceOf(ObjectLiteral);
    })
    it('should throw error', ()=>{
      const program = createProgram(`
      let arr <- [1,[1,2,3], {}];
      let x <- arr["foo"];
      `);
      expect(()=>program.eval(env)).toThrow()
    })
    it('should return null', ()=>{
      const program = createProgram(`
        let arr <- [1,[1,2,3], {}];
        let x <- arr[100];
      `);
      program.eval(env)
      expect(env.lookup('x')).instanceof(NullLiteral);
    })
  })
  describe('Object Literal', () => {
    afterEach(() => {
      env = new Env();
    })
    it('should throw error because member is not object or array', () => {
      const program = createProgram(`
      let a <- 1;
      let x <- a["foo"];
    `)
      expect(() => program.eval(env)).toThrow();
    })
    it('should throw error because property is identifier but identifier value is not literal', () => {
      const program = createProgram(`
      let obj <- {
        foo: "baz",
      };
      let f <- fn(){
        return "foo";
      };
      let y <- obj[f];
    `)
      expect(() => program.eval(env)).toThrow();
    })
    it('x should return string literal and y should return null literal', () => {
      const program = createProgram(`
    let obj <- {
      foo: "bar",
    };
    let x <- obj["foo"];
    let y <- obj["foo2"];
    `);
      program.eval(env);
      expect(env.has('x')).toBe(true)
      expect(env.has('y')).toBe(true);
      expect(env.lookup('x')).instanceOf(StringLiteral);
      expect(env.lookup('y')).instanceOf(NullLiteral);
    })
    it('should return 42', ()=>{
      const program = createProgram(`
        let a <- 42;
        let obj <- {
          a: a
        };
        a <- 43;
        let x <- obj["a"];
      `)
      program.eval(env);
      expect(env.lookup('x')).toBeDefined()
      expect(unwrap(env.lookup('x'))).toBe(42)
    })
    it('call function',()=>{
      const program = createProgram(`
        let a <- 43;
        let obj <- {
          b: fn(){
            return a;
          },
          fib: fn(x){
            if (x==0){
              return 0;
            }
            if (x==1){
              return 1;
            }
            return obj["fib"](x-1) + obj["fib"](x-2);
          }
        };
        let x1 <- obj["b"]();
        let x2 <- obj["fib"](15);
      `)
      program.eval(env);
      expect(env.lookup('x1')).toBeDefined()
      expect(env.lookup('x1')).instanceOf(NumberLiteral) 
      expect(env.lookup('x2')).instanceOf(NumberLiteral) 
      expect(unwrap(env.lookup('x1'))).toBe(43) 
      expect(unwrap(env.lookup('x2'))).toBe(610) 
    }, {repeats: 3})
    it('should return string', () => {
      const program = createProgram(`
      let obj <- {
        a:{
          b:{
            c: "bar"
          }
        }
      };
      let f <- fn (){
        return "a";
      };
      let a <- obj[f()];
      let x <- obj["a"]["b"]["c"];
      let y <- obj["a"];
      let id <- "a";
      let z <- obj[id];
    `);
      program.eval(env);
      expect(env.has('a')).toBe(true);
      expect(env.has('x')).toBe(true);
      expect(env.has('y')).toBe(true);
      expect(env.has('z')).toBe(true);
      expect(env.lookup('x')).instanceOf(StringLiteral);
      expect(env.lookup('a')).instanceOf(ObjectLiteral);
      expect(env.lookup('y')).instanceOf(ObjectLiteral);
      expect(env.lookup('z')).instanceOf(ObjectLiteral);
      expect(unwrap(env.lookup('x'))).toBe("bar")
    })
  })
})