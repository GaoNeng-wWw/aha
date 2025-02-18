import { Token } from "../lexer";
import { AstExpr } from "./node";

export class PrefixExpr extends AstExpr {
  public name = 'Prefix Expression'
  constructor(
    public operator: Token,
    public rhs: AstExpr
  ){
    super();
  }
  eval(): unknown {
    return;
  }
}