import { describe, expect, it } from "vitest";
import { AstNode, NullLiteral } from "@/ast/node";
import { Lexer, LexerRule, Token, TokenKind } from "../../lexer";
import rules from '@/lexer-rules';
import { Parser } from "../parser";
import { Assignment } from "@/ast/assignment";
import { BinaryExpr } from "@/ast/bianry-expr";
import { CallExpr } from "@/ast/call-expr";
import { ExprStmt } from "@/ast/expression-stmt";
import { MemberExpr } from "@/ast/member-expr";
import { NumberLiteral, Identifier } from "@/ast/literal-expression";
import { BlockStmt } from "@/ast/block-stmt";
import { ComputedExpr } from "@/ast/computed-expr";
import { FunctionDeclStmt } from "@/ast/function-declaration-stmt";
import { IfStmt } from "@/ast/if-stmt";
import { VarDeclStmt } from "@/ast/variable-declaration-stmt";
import { PrefixExpr } from "@/ast/prefix-expr";

describe('Parser', ()=>{
  const tokenTobeDefined = (tokens: Token[]) => expect(tokens.length).gt(1);
  const createLexer = (rules: LexerRule[], source: string) => new Lexer(rules,source);
  const createParser = (tokens:Token[]) => new Parser(tokens);

  it('parseExpr', ()=>{
    const lexer = createLexer(rules, '1 + 1 * 2;');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
  })
  it('parseExpr with assignment', () => {
    const lexer = createLexer(rules, 'let x <- 1; let y <- "hello world"; let z<-true;');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
  });
  it('parse binary operator', () => {
    const lexer = createLexer(rules, 'x <- 123; x <- 456;');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot()!;
    expect(root).not.toBeNull();
    const {body} = root;
    expect(body).toHaveLength(2);
    const valid = (node: AstNode) => {
      expect(
        node
      ).toBeInstanceOf(ExprStmt)
      const exprStmt:ExprStmt = node as ExprStmt;
      expect(exprStmt.expr).toBeInstanceOf(Assignment);
      const assignment = exprStmt.expr as Assignment;
      expect(assignment.identifier).toBeInstanceOf(Identifier);
      expect((assignment.identifier as Identifier).val).toBe('x');
      expect(assignment.value).toBeInstanceOf(NumberLiteral);
    }
    valid(body[0])
    valid(body[1])
  });
  it('parse if statement', () => {
    const lexer = createLexer(rules, 'if (x < 10) { y <- 20; }');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const ifStmt = root?.body[0] as IfStmt;
    expect(ifStmt).toBeInstanceOf(IfStmt);
    expect(ifStmt.condition).toBeInstanceOf(BinaryExpr);
    expect(ifStmt.body).toBeInstanceOf(BlockStmt);
    // expect(ifStmt.elseBody).toBeInstanceOf(BlockStmt);
  });
  it('parse if-else', ()=>{
    const lexer = createLexer(rules, 'if (x < 10) { y <- 20; } else { x <- 20; }');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const ifStmt = root?.body[0] as IfStmt;
    expect(ifStmt).toBeInstanceOf(IfStmt);
    expect(ifStmt.condition).toBeInstanceOf(BinaryExpr);
    expect(ifStmt.body).toBeInstanceOf(BlockStmt);
    expect(ifStmt.elseBody).toBeInstanceOf(BlockStmt);
  })
  it('parse function declaration', () => {
    const lexer = createLexer(rules, 'fn foo(x) { return x + 1; }');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const fnDecl = root?.body[0] as FunctionDeclStmt;
    expect(fnDecl).toBeInstanceOf(FunctionDeclStmt);
    expect(fnDecl.fnName).toBe('foo');
    expect(fnDecl.params.length).toBe(1);
    expect(fnDecl.params[0].paramName).toBe('x');
    expect(fnDecl.body.length).toBe(1);
  });
  it('parse variable declaration without initialization', () => {
    const lexer = createLexer(rules, 'let x;');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const varDecl = root?.body[0] as VarDeclStmt;
    expect(varDecl).toBeInstanceOf(VarDeclStmt);
    expect(varDecl.id).toBe('x');
    expect(varDecl.value).toBeInstanceOf(NullLiteral);
  });
  
  it('parse member expression', () => {
    const lexer = createLexer(rules, 'obj.prop;');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const exprStmt = root?.body[0] as ExprStmt;
    expect(exprStmt).toBeInstanceOf(ExprStmt);
    const memberExpr = exprStmt.expr as MemberExpr;
    expect(memberExpr).toBeInstanceOf(MemberExpr);
    expect(memberExpr.member).toBeInstanceOf(Identifier);
    expect((memberExpr.member as Identifier).val).toBe('obj');
    expect(memberExpr.property).toBe('prop');
  });
  
  it('parse computed member expression', () => {
    const lexer = createLexer(rules, 'obj[prop];');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const exprStmt = root?.body[0] as ExprStmt;
    expect(exprStmt).toBeInstanceOf(ExprStmt);
    const computedExpr = exprStmt.expr as ComputedExpr;
    expect(computedExpr).toBeInstanceOf(ComputedExpr);
    expect(computedExpr.member).toBeInstanceOf(Identifier);
    expect((computedExpr.member as Identifier).val).toBe('obj');
    expect(computedExpr.property).toBeInstanceOf(Identifier);
    expect((computedExpr.property as Identifier).val).toBe('prop');
  });
  
  it('parse prefix expression', () => {
    const lexer = createLexer(rules, '-x;');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const exprStmt = root?.body[0] as ExprStmt;
    expect(exprStmt).toBeInstanceOf(ExprStmt);
    const prefixExpr = exprStmt.expr as PrefixExpr;
    expect(prefixExpr).toBeInstanceOf(PrefixExpr);
    expect(prefixExpr.operator.kind).toBe(TokenKind.DASH);
    expect(prefixExpr.rhs).toBeInstanceOf(Identifier);
    expect((prefixExpr.rhs as Identifier).val).toBe('x');
  });
  
  it('parse call expression', () => {
    const lexer = createLexer(rules, 'foo(1, 2);');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const exprStmt = root?.body[0] as ExprStmt;
    expect(exprStmt).toBeInstanceOf(ExprStmt);
    const callExpr = exprStmt.expr as CallExpr;
    expect(callExpr).toBeInstanceOf(CallExpr);
    expect(callExpr.method).toBeInstanceOf(Identifier);
    expect((callExpr.method as Identifier).val).toBe('foo');
    expect(callExpr.argList.length).toBe(2);
    expect(callExpr.argList[0]).toBeInstanceOf(NumberLiteral);
    expect((callExpr.argList[0] as NumberLiteral).val).toBe(1);
    expect(callExpr.argList[1]).toBeInstanceOf(NumberLiteral);
    expect((callExpr.argList[1] as NumberLiteral).val).toBe(2);
  });
  
  it('parse grouping expression', () => {
    const lexer = createLexer(rules, '(1 + 2) * 3;');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const exprStmt = root?.body[0] as ExprStmt;
    expect(exprStmt).toBeInstanceOf(ExprStmt);
    const binaryExpr = exprStmt.expr as BinaryExpr;
    expect(binaryExpr).toBeInstanceOf(BinaryExpr);
    expect(binaryExpr.l).toBeInstanceOf(BinaryExpr);
    const leftBinaryExpr = binaryExpr.l as BinaryExpr;
    expect(leftBinaryExpr.l).toBeInstanceOf(NumberLiteral);
    expect((leftBinaryExpr.l as NumberLiteral).val).toBe(1);
    expect(leftBinaryExpr.r).toBeInstanceOf(NumberLiteral);
    expect((leftBinaryExpr.r as NumberLiteral).val).toBe(2);
    expect(binaryExpr.r).toBeInstanceOf(NumberLiteral);
    expect((binaryExpr.r as NumberLiteral).val).toBe(3);
  });
  it('parse closure', ()=>{
    const lexer = createLexer(rules, `let x <- fn(){ let y <- 1; return fn(){return y;};};`)
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens)
    parser.run();
  })
  it('parse for statement (VarDeclStmt)', ()=>{
    const lexer = createLexer(rules, 'for (let x<-0;x<100;x <- x+1){x;}');
    const tokens = lexer.run()
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run()
  })
  it('parse for statement (Assignment)', ()=>{
    const lexer = createLexer(rules, 'let x; for (x<-0;x<100;x <- x+1){x;}');
    const tokens = lexer.run()
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run()
  })
  it('parse array', ()=>{
    const lexer = createLexer(rules, '[1,2,3,"hello world", true,false, [1,2,3]];');
    const tokens = lexer.run()
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run()
  })
  it('parse object', ()=>{
    const lexer = createLexer(
      rules,
    `
    let obj <- {
      a: 1,
      b: fn(){
      },
      c: [1,2,3, {a: 2}],
    };
    obj.a;
    `);
    const tokens = lexer.run()
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run()
  })
  it('parse null literal', () => {
    const lexer = createLexer(rules, 'let x <- null;');
    const tokens = lexer.run();
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run();
    const root = parser.getRoot();
    expect(root).toBeDefined();
    expect(root?.body.length).toBe(1);
    const varDecl = root?.body[0] as VarDeclStmt;
    expect(varDecl).toBeInstanceOf(VarDeclStmt);
    expect(varDecl.id).toBe('x');
    expect(varDecl.value).toBeInstanceOf(NullLiteral);
  });
})