import { is } from "@/utils";
import { getTokenName, Token, TokenKind } from "../lexer";
import { Env } from "./env";
import { AstExpr, AstNode, NullLiteral } from "./node";
import { BooleanLiteral, Literal, NumberLiteral, Identifier } from "./literal-expression";

export class PrefixExpr extends AstExpr {
  public name = 'Prefix Expression'
  constructor(
    public operator: Token,
    public rhs: AstExpr
  ){
    super();
  }
  eval(env: Env): AstNode {
    switch (this.operator.kind) {
      case TokenKind.NOT:{
        const rhsValue = this.rhs.eval(env);
        if (!is(rhsValue, BooleanLiteral)){
          throw new Error(`Except boolean but found ${rhsValue.name}`);
        }
        return new BooleanLiteral(`${!rhsValue.val}`);
      }
      case TokenKind.DASH:{
        const rhsValue = this.rhs.eval(env);
        if (!is(rhsValue, NumberLiteral)){
          throw new Error(`symbol '-' only used before number`)
        }
        return new NumberLiteral(-rhsValue.val);
      }
      default:
        throw new Error(`Unknown prefix expression ${getTokenName(this.operator.kind)}`)
    }
  }
}