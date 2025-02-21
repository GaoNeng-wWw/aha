import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { AstBooleanLiteral } from "./literal-expression";

export class IfStmt extends AstStmt {
  public name = 'If Statement'
  constructor(
    public condition: AstExpr,
    public body: AstStmt,
    public elseBody: AstStmt
  ){
    super();
  }
  eval(env: Env): unknown {
    if (this.condition.eval(env)){
      this.body.eval(env);
      return;
    }
    this.elseBody.eval(env);
    return;
  }
}