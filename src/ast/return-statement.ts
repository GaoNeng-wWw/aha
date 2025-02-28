import { RETURN } from "@/constant";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { AstLiteral } from "./literal-expression";
import { is } from "@/utils";

export class ReturnStatement extends AstStmt{
  public name = 'Return Statement'
  constructor(
    public value: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    const val = is(this.value, AstLiteral) ? this.value : this.value.eval(env);
    env.insert(RETURN, val);
    env.globalEnv.insert(RETURN, val);
    return val
  }
}