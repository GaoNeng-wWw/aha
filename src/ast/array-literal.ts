import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";

export class ArrayLiteral extends AstStmt {
  public name = 'ArrayLiteral'
  constructor(
    public contents: AstExpr[]
  ){
    super();
  }
  eval(env: Env): AstExpr[] {
    return this.contents
  }
}