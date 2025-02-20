import { describe, expect, it } from "vitest";
import { Lexer, LexerRule, Token, TokenKind } from "../../lexer";
import rules from '@/lexer-rules';
import { Parser } from "../parser";
import { AstAssignment } from "@/ast/assignment";
import { BinaryExpr } from "@/ast/bianry-expr";
import { CallExpr } from "@/ast/call-expr";
import { ExprStmt } from "@/ast/expression-stmt";
import { MemberExpr } from "@/ast/member-expr";
import { AstNumberLiteral, AstSymbolExpr, NullLiteral } from "@/ast/number-expr";
import { BlockStmt } from "@/ast/block-stmt";
import { AstNode } from "@/ast/node";
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
      expect(exprStmt.expr).toBeInstanceOf(AstAssignment);
      const assignment = exprStmt.expr as AstAssignment;
      expect(assignment.identifier).toBeInstanceOf(AstSymbolExpr);
      expect((assignment.identifier as AstSymbolExpr).val).toBe('x');
      expect(assignment.value).toBeInstanceOf(AstNumberLiteral);
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
    expect(memberExpr.member).toBeInstanceOf(AstSymbolExpr);
    expect((memberExpr.member as AstSymbolExpr).val).toBe('obj');
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
    expect(computedExpr.member).toBeInstanceOf(AstSymbolExpr);
    expect((computedExpr.member as AstSymbolExpr).val).toBe('obj');
    expect(computedExpr.property).toBeInstanceOf(AstSymbolExpr);
    expect((computedExpr.property as AstSymbolExpr).val).toBe('prop');
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
    expect(prefixExpr.rhs).toBeInstanceOf(AstSymbolExpr);
    expect((prefixExpr.rhs as AstSymbolExpr).val).toBe('x');
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
    expect(callExpr.method).toBeInstanceOf(AstSymbolExpr);
    expect((callExpr.method as AstSymbolExpr).val).toBe('foo');
    expect(callExpr.argList.length).toBe(2);
    expect(callExpr.argList[0]).toBeInstanceOf(AstNumberLiteral);
    expect((callExpr.argList[0] as AstNumberLiteral).val).toBe(1);
    expect(callExpr.argList[1]).toBeInstanceOf(AstNumberLiteral);
    expect((callExpr.argList[1] as AstNumberLiteral).val).toBe(2);
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
    expect(leftBinaryExpr.l).toBeInstanceOf(AstNumberLiteral);
    expect((leftBinaryExpr.l as AstNumberLiteral).val).toBe(1);
    expect(leftBinaryExpr.r).toBeInstanceOf(AstNumberLiteral);
    expect((leftBinaryExpr.r as AstNumberLiteral).val).toBe(2);
    expect(binaryExpr.r).toBeInstanceOf(AstNumberLiteral);
    expect((binaryExpr.r as AstNumberLiteral).val).toBe(3);
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
  it.only('parse for statement (Assignment)', ()=>{
    const lexer = createLexer(rules, 'let x; for (x<-0;x<100;x <- x+1){x;}');
    const tokens = lexer.run()
    tokenTobeDefined(tokens);
    const parser = createParser(tokens);
    parser.run()
  })
})