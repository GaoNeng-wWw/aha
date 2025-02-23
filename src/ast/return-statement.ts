import { RETURN } from "@/constant";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";

export class ReturnStatement extends AstStmt{
  public name = 'Return Statement'
  constructor(
    public value: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    env.insert(RETURN, true);
    return this.value.eval(env);
  }
}