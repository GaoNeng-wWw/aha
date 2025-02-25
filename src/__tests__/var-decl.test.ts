import { Lexer } from "@/lexer";
import { describe, expect, it } from "vitest";
import rules from '@/lexer-rules';
import { Parser } from "@/parser/parser";
import { beforeEach } from "node:test";
import { Env } from "@/ast/env";
import { createProgram } from "./utils/createProgram";
import { ArrayLiteral, AstNumberLiteral, AstStringLiteral } from "@/ast/literal-expression";

describe('Var Decl', () => {
  let env = new Env();
  beforeEach(()=>{
    env = new Env();
  })
  it('Literal', ()=>{
    const code = `let x <- 123;`;
    const program = createProgram(code);
    program.eval(env);
    expect(env.lookup('x')).toBeDefined()
  })
  it('Decl more var', ()=>{
    const code = `
    let x <- 123;
    let y <- 456;
    let z <- x + y;
    `;
    const program = createProgram(code);
    program.eval(env);
    expect(env.lookup('x')).toBeDefined()
    expect(env.lookup('y')).toBeDefined()
    expect(env.lookup('z')).toBeDefined()
    expect((env.lookup('z') as AstNumberLiteral).eval()).toBe(579)
  })
  it('Ref', () => {
    const code = `
    let x <- 123;
    let y <- [x];
    x <- 456;
    let obj <- {
      foo: "bar",
      a: {
        b: 1
      }
    };
    let z <- obj.foo;
    let b <- obj.a.b;
    let c <- obj["a"]["b"];
    let n <- null;
    `
    const program = createProgram(code);
    program.eval(env);
    expect(env.lookup('x')).toBeDefined()
    expect(env.lookup('y')).toBeDefined()
    expect(env.lookup('z')).toBeDefined()
    expect(env.lookup('b')).toBeDefined()
    expect(env.lookup('c')).toBeDefined()

    expect(env.lookup('x')).instanceof(AstNumberLiteral)
    expect(env.lookup('y')).instanceof(Array)
    expect(env.lookup('z')).instanceof(AstStringLiteral)
    expect(env.lookup('b')).instanceof(AstNumberLiteral)
    expect(env.lookup('c')).instanceof(AstNumberLiteral)
  })
})