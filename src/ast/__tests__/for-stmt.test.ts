import { createProgram } from "@/utils/create";
import { beforeEach, describe } from "node:test";
import { afterEach, expect, it } from "vitest";
import { Env } from "../env";
import { unwrap } from "@/utils";

describe('For Statement',()=>{
  let env = new Env();
  afterEach(()=>{
    env = new Env();
  })
  it('x should return 5050', ()=>{
    const program = createProgram(
    `
    let y <- 0;
    for (let x <- 0; x <= 100; x <- x+1){
      y <- y + x;
    }
    `
    );
    program.eval(env);
    expect(unwrap(env.lookup('y'))).toBe(5050);
  })
  it('Should return 49', ()=>{
    const program = createProgram(
      `
      let y <- 0;
      for (let x <- 0; x <= 100; x <- x+1){
        if (x == 50){
          break;
        }
        y <- x;
      }
      `
    )
    program.eval(env);
    expect(unwrap(env.lookup('y'))).toBe(49);
  })
  it('Should return 0', () => {
    const program = createProgram(
      `
      let y <- 0;
      for (let x <- 0; x <= 100; x <- x+1){
        break;
        y <- x;
      }
      `
    )
    program.eval(env);
    expect(unwrap(env.lookup('y'))).toBe(0);
  })

  it('Should return 49', () => {
    const program = createProgram(
      `
      let y <- 0;
      for (let x <- 0; x <= 100; x <- x+1){
        for (let j <- 0; j <= 100; j <- j + 1){
          break;
          y <- y + 1;
        }
        y <- x;
      }
      `
    )
    program.eval(env);
    expect(unwrap(env.lookup('y'))).toBe(100);
  })
  it('Should Return 50', ()=>{
    const program = createProgram(`
    fn f(){
      for (let x<-0;x<100;x<-x+1){
        if (x == 50){
          return 50;
        }
      }
    }
    let x<-f();
  `)
  program.eval(env)
  expect(unwrap(env.lookup('x'))).toBe(50)
  })
})