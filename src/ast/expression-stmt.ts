import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";

export class ExprStmt extends AstStmt {
  public name = 'Expression Statement'
  constructor(
    public expr: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    return this.expr.eval(env)
  }
}