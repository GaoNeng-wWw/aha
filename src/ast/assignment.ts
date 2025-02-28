import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr } from "./node";
import { Literal, Identifier } from "./literal-expression";

export class Assignment extends AstExpr {
  public name = 'Assignment'
  constructor(
    public identifier: AstExpr,
    public value: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}