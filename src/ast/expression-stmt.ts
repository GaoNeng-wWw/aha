import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { AstNumberLiteral } from "./literal-expression";

export class ExprStmt extends AstStmt {
  public name = 'Expression Statement'
  constructor(
    public expr: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    return !is(this.expr, AstNumberLiteral) ? this.expr.eval(env) : this.expr;
  }
}