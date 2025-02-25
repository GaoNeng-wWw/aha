import { describe, expect, it } from "vitest";
import { beforeEach } from "node:test";
import { Env } from "@/ast/env";
import { createProgram } from "./utils/createProgram";
import { AstNumberLiteral, AstStringLiteral } from "@/ast/literal-expression";

describe('fn', () => {
  let env = new Env();
  beforeEach(()=>{
    env = new Env();
  })
  it('fn decl', ()=>{
    const code = `
    fn f(){
      return 1;
    }
    let x <- f();
    let y <- x + 1;
    `;
    const program = createProgram(code);
    program.eval(env);
    expect(env.lookup('x')).toBeDefined()
    expect(env.lookup('x')).instanceof(AstNumberLiteral);
  })
  it('recursion', () => {
    const code = `
    fn f(x){
      if (x <= 0){
        return 0;
      }
      if (x == 1){
        return 1;
      }
      return f(x-1) + f(x-2);
    }
    let x <- f(15);
    `
    const fib = (x:number):number => {
      if (x<=0){
        return 0;
      }
      if (x === 1){
        return 1;
      }
      return fib(x-1) + fib(x-2)
    }
    const program = createProgram(code);
    program.eval(env)
    expect(env.lookup('x')).instanceof(AstNumberLiteral)
    expect((env.lookup('x') as AstNumberLiteral).eval()).toBe(fib(15))
  })
})