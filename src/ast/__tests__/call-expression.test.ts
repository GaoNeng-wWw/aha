import { createProgram } from "@/utils/create";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Env } from "../env";
import { RETURN } from "@/constant";
import { unwrap } from "@/utils";
import { NumberLiteral } from "../literal-expression";
import { NullLiteral } from "../node";
import builtIn from "../built-in";

describe('Call Expression', ()=>{
  let env = new Env();
  beforeEach(()=>{
    env = new Env();
  })
  it('Except function but found number literal', ()=>{
    const program = createProgram(`
      let x <- 1;
      let y <- x();
    `)
    expect(()=>program.eval(env)).toThrow();
  })
  describe('Function Expression', () => {
    it('None Return', ()=>{
      const program = createProgram(`
        let f <- fn(){
          let x <- 1;
        };
        let x <- f();
      `)
      program.eval(env);
      expect(env.lookup('x')).instanceOf(NullLiteral);
    })
    it('Return Literal', {repeats: 3}, ()=>{
      const program = createProgram(`
      let f <- fn (){
        return 1;
      };
      let x <- f();
    `)
      program.eval(env)
      expect(env.has('x')).toBeTruthy();
      expect(unwrap(env.lookup('x'))).toBe(1)
    })
    it('If Return', {repeats: 3}, ()=>{
      const program = createProgram(
        `
        let f <- fn (x){
          if (x > 10){
            return x;
          } else {
          return 10;
          }
        };
        let x <- f(11);
        let y <- f(1);
        `
      )
      program.eval(env)
      expect(env.lookup('x')).instanceOf(NumberLiteral)
      expect(env.lookup('y')).instanceOf(NumberLiteral)

      expect(unwrap(env.lookup('x'))).toBe(11)
      expect(unwrap(env.lookup('y'))).toBe(10)
    })
    it('Recursive', {repeats: 3}, ()=>{
      const program = createProgram(`
      let fib <- fn (x){
        if (x == 0){
          return 0;
        }
        if (x == 1){
          return 1;
        }
        return fib(x-1) + fib(x-2);
      };
      let x <- fib(15);
      `);
      const fib = (x:number): number => {
        if (x === 0){
          return 0;
        }
        if (x === 1) {
          return 1;
        }
        return fib(x-1) + fib(x-2);
      }
      program.eval(env)
      expect(unwrap(env.lookup('x'))).toBe(fib(15))
    })
  })
  describe('Function Decl', () => {
    it('None return', {repeats: 3}, () => {
      const program = createProgram(`
      fn f(){
        let x <- 1;
      }
      let x <- f();
      `)
      program.eval(env);
      expect(env.lookup('x')).instanceOf(NullLiteral);
    })
    it('Return Literal', {repeats: 3}, ()=>{
      const program = createProgram(`
      fn f(){
        return 1;
      }
      let x <- f();
      `)
      program.eval(env)
      expect(env.has('x')).toBeTruthy();
      expect(unwrap(env.lookup('x'))).toBe(1)
    })
    it('Return Property', () => {
      const program = createProgram(`
        fn f(y){
          return y;
        }
        let x <- f(1);
      `)
      program.eval(env)
      expect(env.has('x')).toBeTruthy();
      expect(unwrap(env.lookup('x'))).toBe(1)
    }, {repeats: 3})
    it('If Return', {repeats: 3}, ()=>{
      const program = createProgram(
        `
        fn f(x){
          if (x > 10){
            return x;
          } else {
          return 10;
          }
        }
        let x <- f(11);
        let y <- f(1);
        `
      )
      program.eval(env)
      expect(env.lookup('x')).instanceOf(NumberLiteral)
      expect(env.lookup('y')).instanceOf(NumberLiteral)

      expect(unwrap(env.lookup('x'))).toBe(11)
      expect(unwrap(env.lookup('y'))).toBe(10)
    })
    it('Recursive', {repeats: 3}, ()=>{
      const program = createProgram(`
      fn fib(x){
        if (x == 0){
          return 0;
        }
        if (x == 1){
          return 1;
        }
        return fib(x-1) + fib(x-2);
      }
      let x <- fib(15);
      `);
      const fib = (x:number): number => {
        if (x === 0){
          return 0;
        }
        if (x === 1) {
          return 1;
        }
        return fib(x-1) + fib(x-2);
      }
      program.eval(env)
      expect(unwrap(env.lookup('x'))).toBe(fib(15))
    })
  })
  it('Bulit In Call', ()=>{
    const program = createProgram(
      `
      show("hello world");
      fn f(){
        return 1;
      }
      let x <- 1;
      let y <- x;
      show(y);
      show(f());
      show(f);
      `
    )
    const f = vi.fn();
    vi.spyOn(builtIn, 'show').mockImplementation(f);
    program.eval(env);
    expect(f).toHaveBeenCalled();
  })
  it('Fast Pow', ()=>{
    const program = createProgram(`
      let x <- pow(2,8);
    `)
    program.eval(env);
    expect(env.lookup('x')).instanceOf(NumberLiteral);
    expect(unwrap(env.lookup('x'))).toBe(2**8)
  })
})