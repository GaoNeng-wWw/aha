import { AstExpr, AstStmt } from "./node";
import { ParameterStmt } from "./parameter";

export class FunctionExpr extends AstExpr {
  public name = 'Function Expression'
  constructor(
    public parameter: ParameterStmt[],
    public body: AstStmt[],
  ){
    super();
  }
}