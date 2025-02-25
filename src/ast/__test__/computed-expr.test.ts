import { describe, expect, it } from "vitest";
import { createNumberLiteral, createObject, createProperty, createStringLiteral } from "./utils";
import { ComputedExpr } from "../computed-expr";
import { Env } from "../env";
import { ObjectLiteral, Property } from "../object-literal";
import { AstNumberLiteral, AstStringLiteral, AstSymbolExpr, NullLiteral } from "../literal-expression";
import { ArrayLiteral } from "../literal-expression";
import { beforeEach } from "node:test";
import { VarDeclStmt } from "../variable-declaration-stmt";

describe('Computed Expression', ()=>{
  const createNestObject = (
    innerProperties: Property[]
  ) => {
    const midValue = createObject(
      [
        createProperty('mid', createObject(innerProperties))
      ]
    )
    const outter = createObject([
      createProperty('outer', midValue)
    ])
    return outter;
  }
  let env = new Env()
  beforeEach(()=>{
    env = new Env();
  })
  describe('Mix', ()=>{
    it('When nested, if not reaching the bottom, return the current value if it exists', () => {
      const obj = createNestObject(
      [
        createProperty(
        'inner',
        new ArrayLiteral(
          [
          new ObjectLiteral(
            [
            createProperty('arr-inner', createNumberLiteral(2))
            ]
          ),
          createNumberLiteral(1)
          ]
        )
        )
      ]
      )
      const select = new ComputedExpr(
        obj,
        createStringLiteral('outer'),
      );
      expect(select.eval(env)).instanceOf(ObjectLiteral);
      expect((select.eval(env) as ObjectLiteral).properties[0].id).toBe('mid');
    })
    it('Nest', ()=>{
      const obj = createNestObject(
        [
          createProperty(
            'inner',
            new ArrayLiteral(
              [
                
                new ObjectLiteral(
                  [
                    createProperty('arr-inner', createNumberLiteral(2))
                  ]
                ),
                createNumberLiteral(1)
              ]
            )
          )
        ]
      )
      const select = new ComputedExpr(
        new ComputedExpr(
          new ComputedExpr(
            new ComputedExpr(
              obj,
              createStringLiteral('outer'),
            ),
            createStringLiteral('mid'),
          ),
          createStringLiteral('inner'),
        ),
        createNumberLiteral(1)
      );
      expect(select.eval(env)).instanceOf(AstNumberLiteral)
      const s2 = new ComputedExpr(
        new ComputedExpr(
          new ComputedExpr(
            new ComputedExpr(
              new ComputedExpr(
                obj,
                createStringLiteral('outer'),
              ),
              createStringLiteral('mid'),
            ),
            createStringLiteral('inner'),
          ),
          createNumberLiteral(0)
        ),
        createStringLiteral('arr-inner')
      );
      expect(s2.eval(env)).instanceof(AstNumberLiteral)
      expect((s2.eval(env) as AstNumberLiteral).val).toBe(2)
    })
  })
  describe('Array', () => {
    it('Not nest', ()=>{
      const arr = new ArrayLiteral(
        [
          createNumberLiteral(1),
          createNumberLiteral(2),
          createNumberLiteral(3),
          createNumberLiteral(4)
        ]
      )
      const v1 = new VarDeclStmt('x', false, arr);
      v1.eval(env);
      const computed = new ComputedExpr(
        new AstSymbolExpr('x'),
        createNumberLiteral(0)
      )
      expect(computed.eval(env)).instanceOf(AstNumberLiteral)
    })
    it('Nest', ()=>{
      const arr = new ArrayLiteral(
        [
          createNumberLiteral(1),
          createNumberLiteral(2),
          new ArrayLiteral(
            [
              createNumberLiteral(3),
              createNumberLiteral(4),
            ]
          ),
          createNumberLiteral(5),
          createNumberLiteral(6)
        ]
      )
      const computed = new ComputedExpr(
        new ComputedExpr(
          arr,
          createNumberLiteral(0)
        ),
        createNumberLiteral(2)
      )
      expect(computed.eval(env)).instanceof(AstNumberLiteral)
    })
  })
  describe('Object', ()=>{
    it('Nest', ()=>{
      const obj = createNestObject(
        [
          createProperty('inner', createNumberLiteral(1))
        ]
      );
      const computed = new ComputedExpr(
        new ComputedExpr(
          new ComputedExpr(
            obj,
            createStringLiteral('outer')
          ),
          createStringLiteral('mid')
        ),
        createStringLiteral('inner')
      );
      const env = new Env();
      expect(computed.eval(env)).instanceOf(AstNumberLiteral);
    })
    it('Not Nest', ()=>{
      const obj = new ObjectLiteral(
        [
          new Property('key', createStringLiteral('key'))
        ]
      );
      const computed = new ComputedExpr(
        obj,
        createStringLiteral('key')
      )
      expect(computed.eval(new Env())).instanceof(AstStringLiteral)
    })
  })
  describe('Computed Expression - MC/DC', () => {
    let env = new Env();
    beforeEach(() => {
      env = new Env();
    });

    it('should return value when object is AstLiteral', () => {
      const literal = createNumberLiteral(42);
      const computed = new ComputedExpr(literal, createStringLiteral('any'));
      expect(computed.eval(env)).toBe(literal);
    });

    it('should return property value when object is Property', () => {
      const property = createProperty('key', createNumberLiteral(42));
      const computed = new ComputedExpr(property, createStringLiteral('key'));
      expect(computed.eval(env)).toBe(property.value);
    });

    it('should return object property value when object is ObjectLiteral and key is AstStringLiteral', () => {
      const obj = createObject([createProperty('key', createNumberLiteral(42))]);
      const computed = new ComputedExpr(obj, createStringLiteral('key'));
      expect(computed.eval(env)).toBe(obj.properties[0].value);
    });

    it('should throw error when object is ObjectLiteral and key is not AstStringLiteral', () => {
      const obj = createObject([createProperty('key', createNumberLiteral(42))]);
      const computed = new ComputedExpr(obj, createNumberLiteral(0));
      expect(() => computed.eval(env)).toThrowError('Key except string type but find Number Literal');
    });

    it('should return array element when object is ArrayLiteral and index is AstNumberLiteral', () => {
      const arr = new ArrayLiteral([createNumberLiteral(1), createNumberLiteral(2)]);
      const computed = new ComputedExpr(arr, createNumberLiteral(1));
      expect(computed.eval(env)).toBe(arr.contents[1]);
    });

    it('should throw error when object is ArrayLiteral and index is not a number', () => {
      const arr = new ArrayLiteral([createNumberLiteral(1), createNumberLiteral(2)]);
      const computed = new ComputedExpr(arr, createStringLiteral('key'));
      expect(() => computed.eval(env)).toThrowError('Index type except number but found string');
    });

    it('should evaluate nested ComputedExpr', () => {
      const obj = createObject([createProperty('key', createNumberLiteral(42))]);
      const nestedComputed = new ComputedExpr(obj, createStringLiteral('key'));
      const computed = new ComputedExpr(nestedComputed, createStringLiteral('key'));
      expect(computed.eval(env)).toBe(nestedComputed.eval(env));
    });

    it('should return NullLiteral when no conditions are met', () => {
      const obj = createObject([]);
      const computed = new ComputedExpr(obj, createStringLiteral('key'));
      expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
    });
  });
  it('should return NullLiteral when property is not found in ObjectLiteral', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const computed = new ComputedExpr(obj, createStringLiteral('nonexistent'));
    expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should throw error when key is not AstStringLiteral in ObjectLiteral', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const computed = new ComputedExpr(obj, createNumberLiteral(0));
    expect(() => computed.eval(env)).toThrowError('Key except string type but find Number Literal');
  });

  it('should return NullLiteral when index is out of bounds in ArrayLiteral', () => {
    const arr = new ArrayLiteral([createNumberLiteral(1), createNumberLiteral(2)]);
    const computed = new ComputedExpr(arr, createNumberLiteral(5));
    expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should throw error when index is not a number in ArrayLiteral', () => {
    const arr = new ArrayLiteral([createNumberLiteral(1), createNumberLiteral(2)]);
    const computed = new ComputedExpr(arr, createStringLiteral('key'));
    expect(() => computed.eval(env)).toThrowError('Index type except number but found string');
  });

  it('should evaluate nested ComputedExpr with ObjectLiteral', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const nestedComputed = new ComputedExpr(obj, createStringLiteral('key'));
    const computed = new ComputedExpr(nestedComputed, createStringLiteral('key'));
    expect(computed.eval(env)).toBe(nestedComputed.eval(env));
  });

  it('should evaluate nested ComputedExpr with ArrayLiteral', () => {
    const arr = new ArrayLiteral([createNumberLiteral(1), createNumberLiteral(2)]);
    const nestedComputed = new ComputedExpr(arr, createNumberLiteral(1));
    const computed = new ComputedExpr(nestedComputed, createNumberLiteral(1));
    expect(computed.eval(env)).toBe(nestedComputed.eval(env));
  });

  it('should return NullLiteral when no conditions are met in nested ComputedExpr', () => {
    const obj = createObject([]);
    const nestedComputed = new ComputedExpr(obj, createStringLiteral('key'));
    const computed = new ComputedExpr(nestedComputed, createStringLiteral('key'));
    expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
  });
  it('should return NullLiteral when property is not found in ObjectLiteral', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const computed = new ComputedExpr(obj, createStringLiteral('nonexistent'));
    expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should throw error when key is not AstStringLiteral in ObjectLiteral', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const computed = new ComputedExpr(obj, createNumberLiteral(0));
    expect(() => computed.eval(env)).toThrowError('Key except string type but find Number Literal');
  });

  it('should return NullLiteral when index is out of bounds in ArrayLiteral', () => {
    const arr = new ArrayLiteral([createNumberLiteral(1), createNumberLiteral(2)]);
    const computed = new ComputedExpr(arr, createNumberLiteral(5));
    expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should throw error when index is not a number in ArrayLiteral', () => {
    const arr = new ArrayLiteral([createNumberLiteral(1), createNumberLiteral(2)]);
    const computed = new ComputedExpr(arr, createStringLiteral('key'));
    expect(() => computed.eval(env)).toThrowError('Index type except number but found string');
  });

  it('should evaluate nested ComputedExpr with ObjectLiteral', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const nestedComputed = new ComputedExpr(obj, createStringLiteral('key'));
    const computed = new ComputedExpr(nestedComputed, createStringLiteral('key'));
    expect(computed.eval(env)).toBe(nestedComputed.eval(env));
  });

  it('should evaluate nested ComputedExpr with ArrayLiteral', () => {
    const arr = new ArrayLiteral([createNumberLiteral(1), createNumberLiteral(2)]);
    const nestedComputed = new ComputedExpr(arr, createNumberLiteral(1));
    const computed = new ComputedExpr(nestedComputed, createNumberLiteral(1));
    expect(computed.eval(env)).toBe(nestedComputed.eval(env));
  });

  it('should return NullLiteral when no conditions are met in nested ComputedExpr', () => {
    const obj = createObject([]);
    const nestedComputed = new ComputedExpr(obj, createStringLiteral('key'));
    const computed = new ComputedExpr(nestedComputed, createStringLiteral('key'));
    expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should return NullLiteral when member is NullLiteral', () => {
    const nullLiteral = new NullLiteral();
    const computed = new ComputedExpr(nullLiteral, createStringLiteral('key'));
    expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should return NullLiteral when property is NullLiteral', () => {
    const obj = createObject([createProperty('key', createNumberLiteral(42))]);
    const computed = new ComputedExpr(obj, new NullLiteral());
    expect(()=>computed.eval(env)).toThrowError()
    // expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
  });

  it('should return NullLiteral when both member and property are NullLiteral', () => {
    const computed = new ComputedExpr(new NullLiteral(), new NullLiteral());
    expect(computed.eval(env)).toBeInstanceOf(NullLiteral);
  });
})