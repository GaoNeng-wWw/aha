import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { NumberLiteral } from "./literal-expression";

export class ExprStmt extends AstStmt {
  public name = 'Expression Statement'
  constructor(
    public expr: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}