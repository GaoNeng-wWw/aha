import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";

// TODO
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