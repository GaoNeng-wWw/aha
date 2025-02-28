import { is } from "@/utils";
import { getTokenName, Token, TokenKind } from "../lexer";
import { Env } from "./env";
import { AstBooleanLiteral, AstLiteral, AstNumberLiteral } from "./literal-expression";
import { AstExpr, AstNode } from "./node";

export class BinaryExpr extends AstExpr {
  public name = 'Binary Expression'
  constructor(
    public l: AstExpr,
    public operator: Token,
    public r: AstExpr
  ){
    super();
  }
  private math(lhs: number, rhs: number, operator: TokenKind){
    switch (operator) {
      case TokenKind.PLUS:
        return lhs + rhs;
      case TokenKind.DASH:
        return lhs - rhs;
      case TokenKind.SLASH:
        return lhs / rhs;
      case TokenKind.STAR:
        return lhs * rhs;
      case TokenKind.PERCENT:
        return lhs % rhs;
      case TokenKind.AND:
        return lhs & rhs;
      case TokenKind.OR:
        return lhs | rhs;
      default:
        throw new Error(`Unkown Math Operator ${getTokenName(operator)}`)
    }

  }
  private logic(lhs: boolean, rhs: boolean, operator: TokenKind){
    switch (operator) {
      case TokenKind.LOGIC_AND:
        return lhs && rhs
      case TokenKind.LOGIC_OR:
        return lhs || rhs
      default:
        throw new Error(`Unknown Logic Operator ${getTokenName(operator)}`)
    }
    
  }
  private compare(lhs: any, rhs: any, operator: TokenKind){
    switch (operator) {
      case TokenKind.EQUALS:
        return lhs === rhs;
      case TokenKind.NOT_EQUALS:
        return lhs !== rhs;
      case TokenKind.LT:
        return lhs < rhs;
      case TokenKind.LTE:
        return lhs<=rhs;
      case TokenKind.GT:
        return lhs > rhs;
      case TokenKind.GTE:
        return lhs >= rhs;
      default:
        throw new Error(`Unknown Compare operator: ${getTokenName(operator)}`)
    }
  }
  eval(env: Env): unknown {
    let _lhs = is(this.l, AstLiteral) ? this.l : this.l.eval(env);
    let _rhs = is(this.r, AstLiteral) ? this.r : this.r.eval(env);
    while (
      !is(_lhs, AstLiteral) && is(_lhs, AstNode)
    ) {
      _lhs = _lhs.eval(env);
    }
    while (
      !is(_rhs, AstLiteral) && is(_rhs, AstNode)
    ) {
      _rhs = _rhs.eval(env);
    }
    if (!is(_lhs,  AstNode) || !is(_rhs, AstNode)){
      process.exit(-1);
    }
    if (!is(_lhs, AstLiteral)){
      throw new Error(`Except Literal but found ${_lhs.name}`)
    }
    if (!is(_rhs, AstLiteral)){
      throw new Error(`Except Literal but found ${_rhs.name}`)
    }
    const lhs = _lhs;
    const rhs = _rhs;
    if (this.operator.isMany(TokenKind.LOGIC_AND, TokenKind.LOGIC_OR)){
      if (!is(lhs, AstBooleanLiteral) ||!is(rhs,AstBooleanLiteral)){
        throw new Error('Logic operator only can used between at boolean')
      }
      return new AstBooleanLiteral(`${this.logic(lhs.eval(), rhs.eval(), this.operator.kind)}`);
    }
    // let lhs = this.l.eval(env) as number | string | boolean | AstNode
    // const rhs = this.r.eval(env) as number | string;
    if (this.operator.isMany(TokenKind.LT,TokenKind.LTE,TokenKind.GT,TokenKind.GTE,TokenKind.EQUALS,TokenKind.NOT_EQUALS)) {
      return this.compare(lhs.eval(env),rhs.eval(env),this.operator.kind);
    }
    // if (this.operator.isMany(TokenKind.LOGIC_AND, TokenKind.LOGIC_OR)){
    //   if (typeof lhs !== 'boolean' || typeof rhs !== 'boolean'){
    //     
    //   }
    //   
    // }
    if (this.operator.isMany(TokenKind.PLUS, TokenKind.DASH,TokenKind.SLASH,TokenKind.STAR,TokenKind.PERCENT, TokenKind.AND, TokenKind.OR)){
      if (!is(lhs, AstNumberLiteral) || !is(rhs, AstNumberLiteral)){
        throw new Error('Math operator only can used between number')
      }
      // if (typeof lhs !== 'number' || typeof rhs !== 'number'){
      // }
      return new AstNumberLiteral(this.math(lhs.eval(), rhs.eval(), this.operator.kind));
    }
    throw new Error('Invalid operator');
  }
}