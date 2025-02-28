import { is } from "@/utils";
import { getTokenName, Token, TokenKind } from "../lexer";
import { Env } from "./env";
import { AstExpr, AstNode } from "./node";
import { AstBooleanLiteral, AstLiteral, AstNumberLiteral, AstSymbolExpr } from "./literal-expression";

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
      case TokenKind.DASH: {
        if (is(this.rhs, AstNumberLiteral)){
          return new AstNumberLiteral(-this.rhs.eval())
        }
        const val = this.rhs.eval(env);
        if (is(val, AstNumberLiteral)) {
          return new AstNumberLiteral(-val);
        }
        throw new Error(`- only be used before numbers`)
      }
      case TokenKind.NOT:
        if (!is(this.rhs, AstNode)){
          return new AstBooleanLiteral(`${!this.rhs}`)
        }
        if (is(this.rhs, AstBooleanLiteral)){
          return new AstBooleanLiteral(`${!this.rhs.eval()}`);
        }
        return new AstBooleanLiteral(`${!this.rhs.eval(env)}`);
      default:
        throw new Error(`${getTokenName(this.operator.kind)} is not prefix `)
    }
  }
}