import { describe, expect, it } from "vitest";
import { AstBooleanLiteral, AstNumberLiteral, AstStringLiteral } from "../literal-expression";
import { VarDeclStmt } from "../variable-declaration-stmt";
import { Env } from "../env";
import { ArrayLiteral } from "../array-literal";

describe('Variable declaration statement', () => {
  it('literal', ()=>{
    const numberLiteral = new AstNumberLiteral(123);
    const s1 = new VarDeclStmt('numberLiteral', false, numberLiteral);
    const s2 = new VarDeclStmt('stringLiteral', false, new AstStringLiteral('string'));
    const s3 = new VarDeclStmt('booleanLiteral', false, new AstBooleanLiteral('true'));
    const s4 = new VarDeclStmt('arrayLiteral', false, new ArrayLiteral([numberLiteral]));
    const env = new Env(null);
    s1.eval(env);
    s2.eval(env);
    s3.eval(env);
    s4.eval(env);
    expect(env.lookup('numberLiteral')).toBeDefined()
    expect(env.lookup('stringLiteral')).toBeDefined()
    expect(env.lookup('booleanLiteral')).toBeDefined()
    expect(env.lookup('arrayLiteral')).toBeDefined()
    expect(env.lookup('numberLiteral')).toBe(123)
    expect(env.lookup('stringLiteral')).toBe('string')
    expect(env.lookup('booleanLiteral')).toBe(true);
    expect(env.lookup('arrayLiteral')).toBeInstanceOf(Array)
  })
})