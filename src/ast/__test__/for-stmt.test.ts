import { describe,expect,it, vi } from "vitest";
import { Env } from "../env";
import { createNumberLiteral, createToken } from "./utils";
import { AstNumberLiteral, AstSymbolExpr } from "../literal-expression";
import { AstAssignment } from "../assignment";
import { BinaryExpr } from "../bianry-expr";
import { TokenKind } from "@/lexer";
import { ForStatement } from "../for-stmt";
import { AstStmt } from "../node";
import { VarDeclStmt } from "../variable-declaration-stmt";
import { BreakStmt } from "../break-stmt";
import { ContinueStmt } from "../continue-stmt";

describe('For statement', ()=>{
  class MockStmt extends AstStmt {
    public count: number = 0;
    constructor(){
      super();
    }
    eval(env: Env): unknown {
      this.count += 1;
      return;
    }
  }
  it('initializer allow identifier only and should execute 10 times', ()=>{
    const env = new Env(null);
    env.insert('x', createNumberLiteral(0));
    const initializer = new AstSymbolExpr('x');
    const condition = new BinaryExpr(
      initializer,
      createToken(TokenKind.LT),
      createNumberLiteral(10)
    )
    const assignment = new AstAssignment(
      initializer,
      new BinaryExpr(
        initializer,
        createToken(TokenKind.PLUS),
        createNumberLiteral(1)
      )
    )
    const mockStmt = new MockStmt();
    const forStatement = new ForStatement(initializer, condition, assignment, [mockStmt]);
    forStatement.eval(env);
    expect(mockStmt.count).toBe(10);
  })
  it('initializer allow vardecl and should exexute 10 times', ()=>{
    const env = new Env(null);
    const initializer = new VarDeclStmt('x', false, createNumberLiteral(0));
    const condition = new BinaryExpr(
      new AstSymbolExpr(initializer.id),
      createToken(TokenKind.LT),
      createNumberLiteral(10)
    )
    const incr = new AstAssignment(
      new AstSymbolExpr('x'),
      new BinaryExpr(
        new AstSymbolExpr('x'),
        createToken(TokenKind.PLUS),
        createNumberLiteral(1)
      )
    )
    const mockStmt = new MockStmt();
    const forStatement = new ForStatement(initializer, condition, incr, [mockStmt]);
    forStatement.eval(env);
    expect(mockStmt.count).toBe(10);
  })
  it('should throw an error for invalid initializer', () => {
    const env = new Env(null);
    const invalidInitializer = createNumberLiteral(0); // Invalid initializer
    const condition = new BinaryExpr(
      new AstSymbolExpr('x'),
      createToken(TokenKind.LT),
      createNumberLiteral(10)
    );
    const incr = new AstAssignment(
      new AstSymbolExpr('x'),
      new BinaryExpr(
        new AstSymbolExpr('x'),
        createToken(TokenKind.PLUS),
        createNumberLiteral(1)
      )
    );
    const mockStmt = new MockStmt();
    const forStatement = new ForStatement(invalidInitializer, condition, incr, [mockStmt]);
    expect(() => forStatement.eval(env)).toThrowError('Invalid initializer: 0');
  });
  
  it('should execute the body zero times if the condition is initially false', () => {
    const env = new Env(null);
    env.insert('x', createNumberLiteral(10));
    const initializer = new AstSymbolExpr('x');
    const condition = new BinaryExpr(
      initializer,
      createToken(TokenKind.LT),
      createNumberLiteral(10)
    );
    const assignment = new AstAssignment(
      initializer,
      new BinaryExpr(
        initializer,
        createToken(TokenKind.PLUS),
        createNumberLiteral(1)
      )
    );
    const mockStmt = new MockStmt();
    const forStatement = new ForStatement(initializer, condition, assignment, [mockStmt]);
    forStatement.eval(env);
    expect(mockStmt.count).toBe(0);
  });
  
  it('should execute the body with complex condition and incrementor', () => {
    const env = new Env(null);
    env.insert('x', createNumberLiteral(0));
    const initializer = new AstSymbolExpr('x');
    const condition = new BinaryExpr(
      initializer,
      createToken(TokenKind.LT),
      createNumberLiteral(20)
    );
    const assignment = new AstAssignment(
      initializer,
      new BinaryExpr(
        initializer,
        createToken(TokenKind.PLUS),
        createNumberLiteral(2)
      )
    );
    const mockStmt = new MockStmt();
    const forStatement = new ForStatement(initializer, condition, assignment, [mockStmt]);
    forStatement.eval(env);
    expect(mockStmt.count).toBe(10);
  });
  it('Break', ()=>{
    const env = new Env(null);
    env.insert('x', createNumberLiteral(0));
    const initializer = new AstSymbolExpr('x');
    const condition = new BinaryExpr(
      initializer,
      createToken(TokenKind.LT),
      createNumberLiteral(20)
    );
    const assignment = new AstAssignment(
      initializer,
      new BinaryExpr(
        initializer,
        createToken(TokenKind.PLUS),
        createNumberLiteral(2)
      )
    );
    const mockStmt = new MockStmt();
    let count = 0;
    vi.spyOn(mockStmt, 'eval').mockImplementation((env) => {
      count += 1;
    })
    const forStmt = new ForStatement(initializer, condition, assignment, [new BreakStmt(), mockStmt]);
    const f2 = new ForStatement(initializer, condition, assignment, [mockStmt]);
    forStmt.eval(env);
    expect(count).toBe(0);
    env.insert('x', createNumberLiteral(0))
    f2.eval(env);
    expect(count).not.toBe(0);
  })
  it('Continue', ()=>{
    const env = new Env(null);
    env.insert('x', createNumberLiteral(0));
    const initializer = new AstSymbolExpr('x');
    const condition = new BinaryExpr(
      initializer,
      createToken(TokenKind.LT),
      createNumberLiteral(20)
    );
    const assignment = new AstAssignment(
      initializer,
      new BinaryExpr(
        initializer,
        createToken(TokenKind.PLUS),
        createNumberLiteral(2)
      )
    );
    const mockStmt = new MockStmt();
    let count = 0;
    vi.spyOn(mockStmt, 'eval').mockImplementation((env) => {
      count += 1;
    })
    const forStmt = new ForStatement(initializer, condition, assignment, [new ContinueStmt(), mockStmt]);
    const f2 = new ForStatement(initializer, condition, assignment, [mockStmt]);
    forStmt.eval(env);
    expect(count).toBe(0);
    env.insert('x', createNumberLiteral(0))
    f2.eval(env);
    expect(count).not.toBe(0);
  })
})