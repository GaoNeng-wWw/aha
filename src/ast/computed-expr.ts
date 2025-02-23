import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode } from "./node";
import { AstSymbolExpr, NullLiteral } from "./literal-expression";
import { ObjectLiteral } from "./object-literal";

export class ComputedExpr extends AstExpr {
  public name = 'Computed Expression';
  constructor(
    public member: AstExpr,
    public property: AstExpr
  ){
    super();
  }
  eval(env:Env): unknown {
    return;
  }
}