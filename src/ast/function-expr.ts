import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { ParameterStmt } from "./parameter";

export class FunctionExpr extends AstExpr {
  public name = 'Function Expression'
  constructor(
    public params: ParameterStmt[],
    public body: AstStmt[],
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}