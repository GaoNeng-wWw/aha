import { MemberExpr } from "@/ast/member-expr";
import { AstAssignment } from "../ast/assignment";
import { BinaryExpr } from "../ast/bianry-expr";
import { BlockStmt } from "../ast/block-stmt";
import { CallExpr } from "../ast/call-expr";
import { ExprStmt } from "../ast/expression-stmt";
import { FunctionDeclStmt } from "../ast/function-declaration-stmt";
import { FunctionExpr } from "../ast/function-expr";
import { IfStmt } from "../ast/if-stmt";
import { AstExpr, AstStmt } from "../ast/node";
import {  ArrayLiteral, AstBooleanLiteral, AstNumberLiteral, AstStringLiteral, AstSymbolExpr, NullLiteral, } from "../ast/literal-expression";
import { ParameterStmt } from "../ast/parameter";
import { PrefixExpr } from "../ast/prefix-expr";
import { VarDeclStmt } from "../ast/variable-declaration-stmt";
import { getTokenName,Token, TokenKind } from "../lexer";
import { BP } from "./bp-lookup";
import { ComputedExpr } from "@/ast/computed-expr";
import { ReturnStatement } from "@/ast/return-statement";
import { ForStatement } from "@/ast/for-stmt";
import { ObjectLiteral, Property } from "@/ast/object-literal";

export type NudParser = () => AstExpr;
export type LedParser = (left: AstExpr, bp: BP) => AstExpr;
export type BPTable = Map<TokenKind, BP>;
export type LedTable = Map<TokenKind, LedParser>;
export type NudTable = Map<TokenKind, NudParser>;
export type StmtHandler = () => AstStmt;
export type StmtLookuo = Map<TokenKind, StmtHandler>;

export class Parser {
  public bpTable:BPTable;
  public nudTable: NudTable;
  public ledTable: LedTable;
  public tokens: Token[];
  public cursor: number;
  public stmtLookup:StmtLookuo = new Map();
  public root: BlockStmt | null = null;

  constructor(
    tokens: Token[]=[]
  ){
    this.bpTable = new Map();
    this.nudTable = new Map();
    this.ledTable = new Map();
    this.tokens = tokens;
    this.cursor = 0;
  }
  run(){
    this.setupTokenLookup();
    const body = [];
    while (this.hasToken()) {
      body.push(
        this.parseStmt()
      )
    }
    this.root = new BlockStmt(body);
    return this.root;
  }
  getRoot(){
    return this.root;
  }
  dump(){
    return JSON.stringify(this.root, null, 2);
  }

  parseExpr(bp: BP){
    const tk = this.currentTokenKind();
    const nudParse = this.nudTable.get(tk)
    if(!nudParse){
      throw new Error(`expcept for token ${TokenKind[tk]}`);
    }
    let left = nudParse.bind(this)();
    while (this.bpTable.get(this.currentTokenKind()) && this.bpTable.get(this.currentTokenKind())! > bp){
      const tk = this.currentTokenKind();
      const led = this.ledTable.get(tk);
      if(!led){
        throw new Error(`expcept for token ${TokenKind[tk]}`);
      }
      left = led.bind(this)(left, bp);
    }
    return left;
  }
  parsePrefixExpr(){
    const operator = this.next();
    const expr = this.parseExpr(BP.UNARY);
    return new PrefixExpr(operator, expr);
  }
  parseAssignment(left: AstExpr, bp:BP){
    this.next();
    const rhs = this.parseExpr(bp);
    return new AstAssignment(left, rhs);
  }
  parseBinaryExpr(l: AstExpr, bp: BP){
    const operator = this.next();
    const r = this.parseExpr(BP.DEFAULT_BP);
    return new BinaryExpr(l,operator,r);
  }
  parsePrimaryExpr(){
    switch (this.currentTokenKind()){
      case TokenKind.NUMBER: {
        return new AstNumberLiteral(Number.parseFloat(this.next().value));
      }
      case TokenKind.STRING: {
        return new AstStringLiteral(this.next().value);
      }
      case TokenKind.IDENTIFIER: {
        return new AstSymbolExpr(this.next().value);
      }
      case TokenKind.BOOLEAN: {
        return new AstBooleanLiteral(this.next().value);
      }
      case TokenKind.NULL: {
        this.next();
        return new NullLiteral();
      }
      default: {
        throw new Error(`Cannot create primary expr from ${TokenKind[this.currentTokenKind()]}`)
      }
    }
  }
  parseMember(lhs: AstExpr, bp: BP){
    const isComputed = this.next().kind === TokenKind.OPEN_BRACKET;
    if (!isComputed){
      return new MemberExpr(lhs, this.expect(TokenKind.IDENTIFIER).value);
    }
    const rhs = this.parseExpr(bp);
    this.expect(TokenKind.CLOSE_BRACKET);
    return new ComputedExpr(
      lhs,rhs
    )
  }
  parseGrouping(){
    this.expect(TokenKind.OPEN_PAREN);
    const expr = this.parseExpr(BP.DEFAULT_BP);
    this.expect(TokenKind.CLOSE_PAREN);
    return expr;
  }
  parseCall(
    lhs: AstExpr,
  ){
    this.next();
    const args = [];
    while (
      this.hasToken() && this.currentTokenKind() !== TokenKind.CLOSE_PAREN
    ){
      args.push(
        this.parseExpr(BP.ASSIGNMENT)
      );
      if (
        !this.peek().isMany(TokenKind.EOF, TokenKind.CLOSE_PAREN)
      ) {
        this.expect(TokenKind.COMMA);
      }
    }
    this.expect(TokenKind.CLOSE_PAREN);
    return new CallExpr(lhs, args)
  }
  parseFnExpr(){
    this.expect(TokenKind.FUNCTION);
    const [params, body] = this.parseFnParamAndBody();
    return new FunctionExpr(params, body);
  }

  parseStmt(){
    const f = this.stmtLookup.get(this.currentTokenKind());
    if (!f){
      return this.parseExprStmt();
    }
    return f.bind(this)();
  }
  parseExprStmt(){
    const expr = this.parseExpr.bind(this)(BP.DEFAULT_BP);
    
    this.expect(TokenKind.SEMI);
    return new ExprStmt(expr);
  }
  parseBlock(){
    this.expect(TokenKind.OPEN_CURLY);
    const body = [];
    while (this.hasToken() && this.currentTokenKind() !== TokenKind.CLOSE_CURLY) {
      body.push(this.parseStmt());
    }
    this.expect(TokenKind.CLOSE_CURLY);
    return new BlockStmt(body);
  }
  parseVarDeclStmt(){
    const token = this.next().kind;
    const name = this.expect(
      TokenKind.IDENTIFIER,
      `Excepted variable name but recived ${TokenKind[this.currentTokenKind()]}`
    )
    // TODO: Type check

    let value;
    if (this.currentTokenKind() !== TokenKind.SEMI) {
      this.expect(TokenKind.ASSIGNMENT);
      value = this.parseExpr(BP.ASSIGNMENT);
    } else {
      value = new NullLiteral();
    }
    this.expect(TokenKind.SEMI);
    return new VarDeclStmt(name.value, false, value);
  }
  parseFnParamAndBody(): [ParameterStmt[], AstStmt[]]{
    const params:ParameterStmt[] = [];
    this.expect(TokenKind.OPEN_PAREN);
    while (
      this.hasToken() && this.currentTokenKind() !== TokenKind.CLOSE_PAREN
    ) {
      if (this.peek().kind === TokenKind.CLOSE_PAREN){
        this.expect(TokenKind.CLOSE_PAREN);
        break;
      }
      const paramName = this.expect(TokenKind.IDENTIFIER).value;
      if (this.peek().kind !== TokenKind.CLOSE_PAREN){
        this.expect(TokenKind.COLON);
      }
      params.push(
        new ParameterStmt(paramName)
      )
      if (
        !this.peek().isMany(TokenKind.CLOSE_PAREN,TokenKind.EOF)
      ) {
        this.expect(TokenKind.COMMA)
      }
    }
    this.expect(TokenKind.CLOSE_PAREN);
    const body = this.parseBlock().body;
    return [params, body];
  }
  parseFnDecl(){
    this.next();
    const fnName = this.expect(TokenKind.IDENTIFIER).value;
    const [params, body] = this.parseFnParamAndBody();
    return new FunctionDeclStmt(params, fnName, body);
  }
  parseIfStmt(): AstStmt{
    this.next();
    const condition = this.parseExpr(BP.ASSIGNMENT);
    const body = this.parseBlock();
    let elseBody:AstStmt = new AstStmt();
    if (this.currentTokenKind() === TokenKind.ELSE) {
      this.next();
      if(this.currentTokenKind() === TokenKind.IF) {
        elseBody = this.parseIfStmt();
      } else {
        elseBody = this.parseBlock();
      }
    }
    return new IfStmt(condition, body, elseBody);
  }
  parseReturn(){
    this.expect(TokenKind.RETURN);
    const returnValue = this.parseExprStmt();
    return new ReturnStatement(returnValue);
  }
  parseForStatement(){
    this.next();
    this.expect(TokenKind.OPEN_PAREN);

    const initialization = this.peek().kind === TokenKind.LET ? this.parseVarDeclStmt() : this.parseExpr(BP.DEFAULT_BP);
    while (this.peek().kind === TokenKind.SEMI) {
      this.expect(TokenKind.SEMI);
    }
    const condition = this.parseExpr(BP.LOGICAL);
    while (this.peek().kind === TokenKind.SEMI) {
      this.expect(TokenKind.SEMI);
    }
    const incrementor = this.parseExpr(BP.DEFAULT_BP);
    this.expect(TokenKind.CLOSE_PAREN);
    return new ForStatement(initialization, condition, incrementor, this.parseBlock().body);
  }
  parseArrayLiteral(){
    this.expect(TokenKind.OPEN_BRACKET);
    const contents:AstExpr[] = [];
    while (
      this.hasToken() && this.currentTokenKind() !== TokenKind.CLOSE_BRACKET
    ) {
      contents.push(this.parseExpr(BP.DEFAULT_BP))
      if (!this.peek().isMany(TokenKind.EOF, TokenKind.CLOSE_BRACKET)) {
        this.expect(TokenKind.COMMA);
      }
    }
    this.expect(TokenKind.CLOSE_BRACKET);
    return new ArrayLiteral(contents);
  }
  parseObjectLiteral(){
    this.expect(TokenKind.OPEN_CURLY);
    const properties:Property[] = [];
    while (
      this.hasToken() && this.currentTokenKind() !== TokenKind.CLOSE_CURLY
    ) {
      const property = this.parseObjectProperty();
      properties.push(property);
      if (!this.peek().isMany(TokenKind.EOF, TokenKind.CLOSE_CURLY)){
        this.expect(TokenKind.COMMA);
      }
    }
    this.expect(TokenKind.CLOSE_CURLY);
    return new ObjectLiteral(properties)
  }
  parseObjectProperty(){
    const id = this.expect(TokenKind.IDENTIFIER).value;
    this.expect(TokenKind.COLON)
    const value = this.parseExpr(BP.DEFAULT_BP);
    return new Property(id, value);
  }

  public peek(){
    return this.tokens[this.cursor];
  }
  public next(){
    const token = this.tokens[this.cursor];
    this.cursor += 1;
    return token;
  }
  public hasToken(){
    return this.cursor < this.tokens.length && this.tokens[this.cursor].kind !== TokenKind.EOF;
  }
  public getTokens(){
    return this.tokens;
  }
  public getCurrentBP(){
    return this.bpTable.get(this.currentTokenKind());
  }
  public currentTokenKind(){
    const tk = this.peek();
    return tk.kind;
  }
  public nud(kind: TokenKind, bp:BP, f: NudParser){
    this.bpTable.set(kind, BP.PRIMAR);
    this.nudTable.set(kind, f);
  }
  public led(kind: TokenKind, bp:BP, f: LedParser){
    this.bpTable.set(kind, bp);
    this.ledTable.set(kind,f);
  }
  stmt(kind: TokenKind, stmt: StmtHandler){
    this.bpTable.set(kind, BP.DEFAULT_BP);
    this.stmtLookup.set(kind, stmt);
  }
  public expect(kind: TokenKind, err?: string){
    const token = this.peek();
    if (token.kind !== kind){
      if (err){
        throw new Error(err);
      }
      throw new Error(`Expcetion ${getTokenName(kind)} but find ${getTokenName(token.kind)}`);
    }
    return this.next();
  }
  public setupTokenLookup(){
    this.led(TokenKind.ASSIGNMENT, BP.ASSIGNMENT, this.parseAssignment);

    this.led(TokenKind.LOGIC_AND, BP.LOGICAL, this.parseBinaryExpr);
    this.led(TokenKind.LOGIC_OR, BP.LOGICAL, this.parseBinaryExpr);
    this.led(TokenKind.AND, BP.LOGICAL, this.parseBinaryExpr);
    this.led(TokenKind.OR, BP.LOGICAL, this.parseBinaryExpr);

    this.led(TokenKind.LT, BP.RELATIONAL, this.parseBinaryExpr);
    this.led(TokenKind.LTE, BP.RELATIONAL, this.parseBinaryExpr);
    this.led(TokenKind.GT, BP.RELATIONAL, this.parseBinaryExpr);
    this.led(TokenKind.GTE, BP.RELATIONAL, this.parseBinaryExpr);
    this.led(TokenKind.EQUALS, BP.RELATIONAL, this.parseBinaryExpr);
    this.led(TokenKind.NOT_EQUALS, BP.RELATIONAL, this.parseBinaryExpr);

    this.led(TokenKind.PLUS, BP.ADDITIVE, this.parseBinaryExpr);
    this.led(TokenKind.DASH, BP.ADDITIVE, this.parseBinaryExpr);
    this.led(TokenKind.SLASH, BP.MULTIPLICATIVE, this.parseBinaryExpr);
    this.led(TokenKind.STAR, BP.MULTIPLICATIVE, this.parseBinaryExpr);
    this.led(TokenKind.PERCENT, BP.MULTIPLICATIVE, this.parseBinaryExpr);

    this.nud(TokenKind.NUMBER, BP.PRIMAR, this.parsePrimaryExpr);
    this.nud(TokenKind.STRING, BP.PRIMAR, this.parsePrimaryExpr);
    this.nud(TokenKind.BOOLEAN, BP.PRIMAR, this.parsePrimaryExpr);
    this.nud(TokenKind.IDENTIFIER, BP.PRIMAR, this.parsePrimaryExpr);
    this.nud(TokenKind.OPEN_BRACKET, BP.PRIMAR, this.parseArrayLiteral);
    this.nud(TokenKind.OPEN_CURLY, BP.PRIMAR, this.parseObjectLiteral);
    this.nud(TokenKind.NULL,BP.PRIMAR,this.parsePrimaryExpr);
    
    this.nud(TokenKind.DASH, BP.UNARY, this.parsePrefixExpr);
    this.nud(TokenKind.NOT, BP.UNARY, this.parsePrefixExpr);

    this.led(TokenKind.DOT, BP.MEMBER, this.parseMember);
    this.led(TokenKind.OPEN_BRACKET, BP.MEMBER, this.parseMember);
    this.led(TokenKind.OPEN_PAREN, BP.CALL, this.parseCall);

    this.nud(TokenKind.OPEN_PAREN, BP.DEFAULT_BP, this.parseGrouping);
    this.nud(TokenKind.FUNCTION, BP.DEFAULT_BP, this.parseFnExpr);

    this.stmt(TokenKind.OPEN_CURLY, this.parseBlock);
    this.stmt(TokenKind.LET, this.parseVarDeclStmt);
    this.stmt(TokenKind.FUNCTION, this.parseFnDecl);
    this.stmt(TokenKind.IF, this.parseIfStmt);
    this.stmt(TokenKind.RETURN, this.parseReturn);
    this.stmt(TokenKind.FOR, this.parseForStatement);
  }
}