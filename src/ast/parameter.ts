import { Env } from "./env";
import { AstStmt } from "./node";

export class ParameterStmt extends AstStmt{
  public name = 'Parameter Statement';
  constructor(
    public paramName: string
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}