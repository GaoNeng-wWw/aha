import { beforeEach, describe, expect, it } from "vitest";
import { Env } from "../env";
import { createNumberLiteral, createObject, createProperty } from "./utils";
import { ObjectLiteral, Property } from "../object-literal";
import { MemberExpr } from "../member-expr";
import { AstNumberLiteral, AstSymbolExpr, NullLiteral } from "../literal-expression";
import { VarDeclStmt } from "../variable-declaration-stmt";

describe('MemberExpression', ()=>{
  let env = new Env();
  beforeEach(()=>{
    env = new Env()
  })
  it('Should return AstNumberLiteral', ()=>{
    const v = new VarDeclStmt('v1', false, createNumberLiteral(2))
    v.eval(env)
    const obj = createObject(
      [
        createProperty('key', createNumberLiteral(1)),
        createProperty('k2', new AstSymbolExpr('v1'))
      ]
    )
    const member = new MemberExpr(obj, 'key');
    const member2 = new MemberExpr(obj, 'k2');
    const res = member.eval(env) as AstNumberLiteral;
    const r2 = member2.eval(env) as AstNumberLiteral;
    expect(res).instanceOf(AstNumberLiteral);
    expect(r2).instanceOf(AstSymbolExpr);
    expect(res.val).toBe(1)
  })
  it('Should return NullLiteral, because property not in member', ()=>{
    const obj = createObject(
      [
        createProperty('key', createNumberLiteral(1))
      ]
    )
    const member = new MemberExpr(obj, 'not-exists-key');
    const res = member.eval(env);
    expect(res).instanceOf(NullLiteral);
  })
  describe('Nest', ()=>{
    it('Should return AstNumberLiteral', ()=>{
      const nestObject = createObject(
        [
          createProperty(
            'k1',
            createObject(
              [
                createProperty(
                  'k11',
                  createNumberLiteral(1)
                )
              ]
            )
          )
        ]
      )
      const memberExpression = new MemberExpr(
        new MemberExpr(
          nestObject,
          'k1'
        ),
        'k11'
      ).eval(env)
      expect(memberExpression).instanceof(AstNumberLiteral)
    })
    it('Should return AstObjectLiteral', () => {
      const nestObject = createObject(
        [
          createProperty(
            'k1',
            createObject(
              [
                createProperty(
                  'k11',
                  createNumberLiteral(1)
                )
              ]
            )
          )
        ]
      )
      const memberExpression = new MemberExpr(
        nestObject,
        'k1'
      ).eval(env)
      expect(memberExpression).instanceOf(ObjectLiteral)
      expect((memberExpression as ObjectLiteral).properties[0].id).toBe('k11')
    })
    it('Should return NullLiteral', () => {
      const nestObject = createObject(
        [
          createProperty(
            'k1',
            createObject(
              [
                createProperty(
                  'k11',
                  createNumberLiteral(1)
                )
              ]
            )
          )
        ]
      )
      const memberExpression = new MemberExpr(
        nestObject,
        'k12'
      ).eval(env)
      expect(memberExpression).instanceOf(NullLiteral)
    })
  })
  it('should return value when member is AstLiteral', () => {
    const literal = createNumberLiteral(42);
    const memberExpr = new MemberExpr(literal, 'any');
    expect(memberExpr.eval(env)).toBe(literal);
  });

  it('should return property value when member is Property', () => {
    const property = createProperty('key', createNumberLiteral(42));
    const memberExpr = new MemberExpr(property, 'key');
    expect(memberExpr.eval(env)).toBe(property.value);
  });

  it('should return object property value when member is ObjectLiteral and key exists', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const memberExpr = new MemberExpr(obj, 'key');
    expect(memberExpr.eval(env)).toBe(obj.properties[0].value);
  });

  it('should return NullLiteral when member is ObjectLiteral and key does not exist', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const memberExpr = new MemberExpr(obj, 'nonexistent');
    expect(memberExpr.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should evaluate nested MemberExpr', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const nestedMemberExpr = new MemberExpr(obj, 'key');
    const memberExpr = new MemberExpr(nestedMemberExpr, 'key');
    expect(memberExpr.eval(env)).toBe(nestedMemberExpr.eval(env));
  });

  it('should return NullLiteral when member is NullLiteral', () => {
    const nullLiteral = new NullLiteral();
    const memberExpr = new MemberExpr(nullLiteral, 'key');
    expect(memberExpr.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should return NullLiteral when member is null', () => {
    const memberExpr = new MemberExpr(null as any, 'key');
    expect(memberExpr.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should return NullLiteral when member is undefined', () => {
    const memberExpr = new MemberExpr(undefined as any, 'key');
    expect(memberExpr.eval(env)).toBeInstanceOf(NullLiteral);
  });
})