import { is, unwrap } from "@/utils";
import { getTokenName, Token, TokenKind } from "../lexer";
import { Env } from "./env";
import { BooleanLiteral, Literal, NumberLiteral } from "./literal-expression";
import { AstExpr, AstNode, AstStmt, NullLiteral } from "./node";

export class BinaryExpr extends AstExpr {
  public name = 'Binary Expression'
  constructor(
    public l: AstExpr,
    public operator: Token,
    public r: AstExpr
  ){
    super();
  }
  private except(val: unknown, clazz: Clazz<any>, errMessage?:string) {
    if (!is(val, clazz)){
      throw new Error(errMessage ?? `Except ${clazz.name} but found ${val}`);
    }
  }
  eval(env: Env): AstNode {
    const lhs = this.l.eval(env);
    const rhs = this.r.eval(env);
    if (
      this.operator.isMany(
        TokenKind.PLUS,TokenKind.DASH,TokenKind.STAR,TokenKind.SLASH,
        TokenKind.PERCENT, TokenKind.AND, TokenKind.OR, 
      )
    ) {
      const _lhs = is(lhs,Literal) ? lhs : lhs.eval(env);
      const _rhs = is(rhs,Literal) ? rhs : rhs.eval(env);
      this.except(_lhs, NumberLiteral);
      this.except(_rhs, NumberLiteral);
      switch (this.operator.kind) {
        case TokenKind.AND:
          return new NumberLiteral(unwrap<number>(_lhs) & unwrap<number>(_rhs))
        case TokenKind.OR:
          return new NumberLiteral(unwrap<number>(_lhs) | unwrap<number>(_rhs))
        case TokenKind.PLUS:
          return new NumberLiteral(unwrap<number>(_lhs) + unwrap<number>(_rhs))
        case TokenKind.DASH:
          return new NumberLiteral(unwrap<number>(_lhs) - unwrap<number>(_rhs))
        case TokenKind.SLASH:
          return new NumberLiteral(unwrap<number>(_lhs) / unwrap<number>(_rhs))
        case TokenKind.STAR:
          return new NumberLiteral(unwrap<number>(_lhs) * unwrap<number>(_rhs))
        case TokenKind.PERCENT:
          return new NumberLiteral(unwrap<number>(_lhs) % unwrap<number>(_rhs))
      }
    }
    if (
      this.operator.isMany(
        TokenKind.EQUALS,TokenKind.NOT_EQUALS,TokenKind.LT,TokenKind.LTE,TokenKind.GT,TokenKind.GTE
      )
    ) {
      const _lhs = is(lhs,Literal) ? lhs : lhs.eval(env);
      const _rhs = is(rhs,Literal) ? rhs : rhs.eval(env);
      switch (this.operator.kind) {
        case TokenKind.EQUALS:
          return new BooleanLiteral(`${unwrap<any>(_lhs) === unwrap<any>(_rhs)}`)
        case TokenKind.NOT_EQUALS:
          return new BooleanLiteral(`${unwrap<any>(_lhs) !== unwrap<any>(_rhs)}`)
        case TokenKind.LT:
          return new BooleanLiteral(`${unwrap<any>(_lhs) < unwrap<any>(_rhs)}`)
        case TokenKind.LTE:
          return new BooleanLiteral(`${unwrap<any>(_lhs) <= unwrap<any>(_rhs)}`)
        case TokenKind.GT:
          return new BooleanLiteral(`${unwrap<any>(_lhs) > unwrap<any>(_rhs)}`)
        case TokenKind.GTE:
          return new BooleanLiteral(`${unwrap<any>(_lhs) >= unwrap<any>(_rhs)}`)
      }
    }
    if (
      this.operator.isMany(
        TokenKind.LOGIC_AND, TokenKind.LOGIC_OR
      )
    ) {
      const _lhs = is(lhs,Literal) ? lhs : lhs.eval(env);
      const _rhs = is(rhs,Literal) ? rhs : rhs.eval(env);
      this.except(_lhs, BooleanLiteral)
      this.except(_rhs, BooleanLiteral)
      const lhsValue = unwrap<boolean>(lhs);
      const rhsValue = unwrap<boolean>(rhs);
      switch (this.operator.kind){
        case TokenKind.LOGIC_AND: 
          return new BooleanLiteral(`${lhsValue && rhsValue}`);
        case TokenKind.LOGIC_OR:
          return new BooleanLiteral(`${lhsValue || rhsValue}`);
      }
    }
    throw new Error('Unsupport operator')
  }
}