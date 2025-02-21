import { getTokenName, Token, TokenKind } from "../lexer";
import { Env } from "./env";
import { AstExpr } from "./node";

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
  private logic(lhs: string, rhs: string, operator: TokenKind){
    switch (operator) {
      case TokenKind.LOGIC_AND:
        return JSON.parse(lhs) && JSON.parse(rhs);
      case TokenKind.LOGIC_OR:
        return JSON.parse(lhs) || JSON.parse(rhs);
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
    const lhs = this.l.eval(env) as number | string;
    const rhs = this.r.eval(env) as number | string;
    if (this.operator.isMany(TokenKind.LT,TokenKind.LTE,TokenKind.GT,TokenKind.GTE,TokenKind.EQUALS,TokenKind.NOT_EQUALS)) {
      return this.compare(lhs,rhs,this.operator.kind);
    }
    if (this.operator.isMany(TokenKind.LOGIC_AND, TokenKind.LOGIC_OR)){
      if (typeof lhs !== 'boolean' || typeof rhs !== 'boolean'){
        throw new Error('Logic operator only can used between at boolean')
      }
      return this.logic(lhs, rhs, this.operator.kind);
    }
    if (this.operator.isMany(TokenKind.PLUS, TokenKind.DASH,TokenKind.SLASH,TokenKind.STAR,TokenKind.PERCENT, TokenKind.AND, TokenKind.OR)){
      if (typeof lhs !== 'number' || typeof rhs !== 'number'){
        throw new Error('Math operator only can used between number')
      }
      return this.math(lhs, rhs, this.operator.kind);
    }
    throw new Error('Invalid operator');
  }
}