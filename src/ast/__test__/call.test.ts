import { describe, expect, it } from "vitest";
import { createCall, createFn, createNumberLiteral, createToken } from "./utils";
import { ParameterStmt } from "../parameter";
import { IfStmt } from "../if-stmt";
import { BinaryExpr } from "../bianry-expr";
import { AstSymbolExpr, NullLiteral } from "../literal-expression";
import { TokenKind } from "@/lexer";
import { ReturnStatement } from "../return-statement";
import { AstStmt } from "../node";
import { CallExpr } from "../call-expr";
import { Env } from "../env";
import { FunctionExpr } from "../function-expr";
import { VarDeclStmt } from "../variable-declaration-stmt";

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
    const env = new Env();
    const f = new VarDeclStmt('fib', false, fib);
    f.eval(env);
    expect(env.lookup('fib')).toBe(fib);
    expect(new CallExpr(new AstSymbolExpr('fib'), [createNumberLiteral(15)]).eval(env)).toBe(_fib(15));
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
    expect(new CallExpr(new AstSymbolExpr('fib'), [createNumberLiteral(15)]).eval(env)).toBe(_fib(15));
  })
})