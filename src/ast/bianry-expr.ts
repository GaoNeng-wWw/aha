import { Token } from "../lexer";
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
}