import { RETURN } from "@/constant";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { Literal } from "./literal-expression";
import { is } from "@/utils";

export class ReturnStatement extends AstStmt{
  public name = 'Return Statement'
  constructor(
    public value: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}