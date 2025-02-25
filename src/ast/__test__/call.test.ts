import { describe, expect, it } from "vitest";
import { createCall, createFn, createNumberLiteral, createToken } from "./utils";
import { ParameterStmt } from "../parameter";
import { IfStmt } from "../if-stmt";
import { BinaryExpr } from "../bianry-expr";
import { AstNumberLiteral, AstSymbolExpr, NullLiteral } from "../literal-expression";
import { TokenKind } from "@/lexer";
import { ReturnStatement } from "../return-statement";
import { AstStmt } from "../node";
import { CallExpr } from "../call-expr";
import { Env } from "../env";
import { FunctionExpr } from "../function-expr";
import { VarDeclStmt } from "../variable-declaration-stmt";
import { ForStatement } from "../for-stmt";
import { AstAssignment } from "../assignment";

describe('Call', ()=>{
  const _fib = (n: number):number => {
    if (n === 0) { return 0;}
    if (n === 1) { return 1;}
    return _fib(n-1) + _fib(n-2);
  }
  it('Function Expression', ()=>{
    const env = new Env();
    const f = new FunctionExpr(
      [],
      []
    )
    const f2 = new VarDeclStmt('f', false, f);
    f2.eval(env);
    expect(env.lookup('f')).toBe(f);
    const call = createCall('f', []);
    expect(call.eval(env)).instanceOf(NullLiteral)
  })
  it('For loop with nested If statement', () => {
    const env = new Env();
    const forLoop = new FunctionExpr(
      [new ParameterStmt('n')],
      [
        new ForStatement(
          new VarDeclStmt('i', false, createNumberLiteral(0)),
          new BinaryExpr(
            new AstSymbolExpr('i'),
            createToken(TokenKind.LT),
            new AstSymbolExpr('n')
          ),
          new AstAssignment(
            new AstSymbolExpr('i'),
            new BinaryExpr(new AstSymbolExpr('i'), createToken(TokenKind.PLUS), createNumberLiteral(1))
          ),
          [
            new IfStmt(
              new BinaryExpr(
                new AstSymbolExpr('i'),
                createToken(TokenKind.EQUALS),
                createNumberLiteral(5)
              ),
              new ReturnStatement(
                createNumberLiteral(5)
              ),
              new AstStmt()
            )
          ]
        ),
        new ReturnStatement(
          createNumberLiteral(-1)
        )
      ]
    );
    const f = new VarDeclStmt('forLoop', false, forLoop);
    f.eval(env);
    expect(env.lookup('forLoop')).toBe(forLoop);

    const call1 = new CallExpr(new AstSymbolExpr('forLoop'), [createNumberLiteral(10)]);
    expect((call1.eval(env) as AstNumberLiteral).val).toBe(5);

    const call2 = new CallExpr(new AstSymbolExpr('forLoop'), [createNumberLiteral(3)]);
    expect((call2.eval(env) as AstNumberLiteral).val).toBe(-1);
  });
  it('Nested If Statements', () => {
    const env = new Env();
    const nestedIf = new FunctionExpr(
      [new ParameterStmt('x')],
      [
        new IfStmt(
          new BinaryExpr(
            new AstSymbolExpr('x'),
            createToken(TokenKind.GT),
            createNumberLiteral(10)
          ),
          new IfStmt(
            new BinaryExpr(
              new AstSymbolExpr('x'),
              createToken(TokenKind.LT),
              createNumberLiteral(20)
            ),
            new ReturnStatement(
              createNumberLiteral(1)
            ),
            new ReturnStatement(
              createNumberLiteral(2)
            )
          ),
          new ReturnStatement(
            createNumberLiteral(0)
          )
        )
      ]
    );
    const f = new VarDeclStmt('nestedIf', false, nestedIf);
    f.eval(env);
    expect(env.lookup('nestedIf')).toBe(nestedIf);

    const call1 = new CallExpr(new AstSymbolExpr('nestedIf'), [createNumberLiteral(15)]);
    const call1Res = call1.eval(env);
    expect(call1Res).instanceof(AstNumberLiteral);
    expect((call1Res as AstNumberLiteral).eval()).toBe(1);

    const call2 = new CallExpr(new AstSymbolExpr('nestedIf'), [createNumberLiteral(25)]);
    const call2Res = call2.eval(env);
    expect(call2Res).instanceof(AstNumberLiteral);
    expect((call2Res as AstNumberLiteral).eval()).toBe(2);

    const call3 = new CallExpr(new AstSymbolExpr('nestedIf'), [createNumberLiteral(5)]);
    const call3Res = call3.eval(env);
    expect(call3Res).instanceof(AstNumberLiteral);
    expect((call3Res as AstNumberLiteral).eval()).toBe(0);

    const call4 = new CallExpr(new AstSymbolExpr('nestedIf'), [createNumberLiteral(10)]);
    const call4Res = call4.eval(env);
    expect(call4Res).instanceof(AstNumberLiteral);
    expect((call4Res as AstNumberLiteral).eval()).toBe(0)

    const call5 = new CallExpr(new AstSymbolExpr('nestedIf'), [createNumberLiteral(20)]);
    const call5Res = call5.eval(env);
    expect(call5Res).instanceof(AstNumberLiteral);
    expect((call5Res as AstNumberLiteral).eval()).toBe(2)
  });
  it('Function Expression recursion', ()=>{
    const fib = new FunctionExpr(
      [
        new ParameterStmt('x')
      ],
      [
        new IfStmt(
          new BinaryExpr(
            new AstSymbolExpr('x'),
            createToken(TokenKind.EQUALS),
            createNumberLiteral(0)
          ),
          new ReturnStatement(
            createNumberLiteral(0)
          ),
          new AstStmt()
        ),
        new IfStmt(
          new BinaryExpr(
            new AstSymbolExpr('x'),
            createToken(TokenKind.EQUALS),
            createNumberLiteral(1)
          ),
          new ReturnStatement(
            createNumberLiteral(1)
          ),
          new AstStmt()
        ),
        new ReturnStatement(
          new BinaryExpr(
            new CallExpr(
              new AstSymbolExpr('fib'),
              [new BinaryExpr(new AstSymbolExpr('x'), createToken(TokenKind.DASH), createNumberLiteral(1))]
            ),
            createToken(TokenKind.PLUS),
            new CallExpr(
              new AstSymbolExpr('fib'),
              [new BinaryExpr(new AstSymbolExpr('x'), createToken(TokenKind.DASH), createNumberLiteral(2))]
            ),
          )
        )
      ]
    );
    const env = new Env();
    const f = new VarDeclStmt('fib', false, fib);
    f.eval(env);
    expect(env.lookup('fib')).toBe(fib);
    const res = new CallExpr(new AstSymbolExpr('fib'), [createNumberLiteral(10)]).eval(env);
    expect(res).instanceOf(AstNumberLiteral);
    expect((res as AstNumberLiteral).eval()).toBe(_fib(10));
  })
  it('Except Identifier but found number', ()=>{
    const env = new Env();
    const f = createFn(
      'f',
      [],
      []
    )
    f.eval(env)
    const call = new CallExpr(createNumberLiteral(1), [])
    expect(()=>call.eval(env)).toThrowError(`Except identifier, but found Number Literal`)
  })
  it('No return should auto return null', ()=>{
    const env = new Env();
    const f = createFn(
      'f',
      [],
      []
    )
    f.eval(env)
    const call = createCall('f', []);
    expect(call.eval(env)).instanceof(NullLiteral);
  })
  it('Not find function', ()=>{
    const env = new Env();
    const call = createCall('f', []);
    expect(()=>call.eval(env)).toThrowError(`f is not function`)
  })
  it('Too many arguments', ()=>{
    const env = new Env();
    const f = createFn(
      'f',
      [],
      []
    )
    f.eval(env)
    const call = createCall('f', [createNumberLiteral(1)]);
    expect(()=>call.eval(env)).toThrow('Too many arguments, function requires 0 arguments, but received 1');
  })
  it('Too few arguments', ()=>{
    const env = new Env();
    const f = createFn(
      'f',
      [new ParameterStmt('x')],
      []
    )
    f.eval(env)
    const call = createCall('f', []);
    expect(()=>call.eval(env)).toThrow('Too few arguments, function requires 1 arguments, but received 0');
  })
  it('recursion (Fibonacci)',()=>{
    const env = new Env()
    const fib = createFn(
      'fib',
      [
        new ParameterStmt('x')
      ],
      [
        new IfStmt(
          new BinaryExpr(
            new AstSymbolExpr('x'),
            createToken(TokenKind.EQUALS),
            createNumberLiteral(0)
          ),
          new ReturnStatement(
            createNumberLiteral(0)
          ),
          new AstStmt()
        ),
        new IfStmt(
          new BinaryExpr(
            new AstSymbolExpr('x'),
            createToken(TokenKind.LT),
            createNumberLiteral(1)
          ),
          new ReturnStatement(
            createNumberLiteral(1)
          ),
          new AstStmt()
        ),
        new ReturnStatement(
          new BinaryExpr(
            new CallExpr(
              new AstSymbolExpr('fib'),
              [new BinaryExpr(new AstSymbolExpr('x'), createToken(TokenKind.DASH), createNumberLiteral(1))]
            ),
            createToken(TokenKind.PLUS),
            new CallExpr(
              new AstSymbolExpr('fib'),
              [new BinaryExpr(new AstSymbolExpr('x'), createToken(TokenKind.DASH), createNumberLiteral(2))]
            ),
          )
        )
      ]
    );
    fib.eval(env);
    const res = new CallExpr(new AstSymbolExpr('fib'), [createNumberLiteral(15)]).eval(env);
    expect(res).instanceOf(AstNumberLiteral);
    expect((res as AstNumberLiteral).val).toBe(_fib(15))
  })
})