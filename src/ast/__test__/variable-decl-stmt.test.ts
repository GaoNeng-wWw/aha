import { describe, expect, it } from "vitest";
import { AstBooleanLiteral, AstNumberLiteral, AstStringLiteral,ArrayLiteral } from "../literal-expression";
import { VarDeclStmt } from "../variable-declaration-stmt";
import { Env } from "../env";
// import { ArrayLiteral } from "../array-literal";

describe('Variable declaration statement', () => {
  it('literal', ()=>{
    const numberLiteral = new AstNumberLiteral(123);
    const astStringLiteral = new AstStringLiteral('string')
    const astBooleanLiteral = new AstBooleanLiteral('true')
    const arrayLiteral = new ArrayLiteral([numberLiteral])
    const s1 = new VarDeclStmt('numberLiteral', false, numberLiteral);
    const s2 = new VarDeclStmt('stringLiteral', false, astStringLiteral);
    const s3 = new VarDeclStmt('booleanLiteral', false, astBooleanLiteral);
    const s4 = new VarDeclStmt('arrayLiteral', false, arrayLiteral);
    const env = new Env(null);
    s1.eval(env);
    s2.eval(env);
    s3.eval(env);
    s4.eval(env);
    expect(env.lookup('numberLiteral')).toBeDefined()
    expect(env.lookup('stringLiteral')).toBeDefined()
    expect(env.lookup('booleanLiteral')).toBeDefined()
    expect(env.lookup('arrayLiteral')).toBeDefined()
    expect(env.lookup('numberLiteral')).toBe(numberLiteral)
    expect(env.lookup('stringLiteral')).toBe(astStringLiteral)
    expect(env.lookup('booleanLiteral')).toBe(astBooleanLiteral);
    expect(env.lookup('arrayLiteral')).instanceof(Array)
  })
})