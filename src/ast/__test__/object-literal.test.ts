import { describe, expect, it } from "vitest";
import { ObjectLiteral, Property } from "../object-literal";
import { createNumberLiteral } from "./utils";
import { AstBooleanLiteral, AstStringLiteral } from "../literal-expression";
import { VarDeclStmt } from "../variable-declaration-stmt";
import { Env } from "../env";


describe('Object Literal', ()=>{
  it('Assignment', ()=>{
    const obj = new ObjectLiteral(
      [
        new Property('number', createNumberLiteral(1)),
        new Property('str', new AstStringLiteral('hello')),
        new Property('bool', new AstBooleanLiteral('true'))
      ]
    )
    const variable = new VarDeclStmt('v', false, obj);
    const env = new Env();
    variable.eval(env);
    expect(env.has('v')).toBe(true);
    const varValue = env.lookup('v') as ObjectLiteral;
    expect(varValue.properties.length).toBe(obj.properties.length);
    expect(varValue).toBe(obj);
  })
})

it('Property', ()=>{
  const p = new Property('key', createNumberLiteral(1));
  const env = new Env();
  expect(p.eval(env)).toBe(1)
})