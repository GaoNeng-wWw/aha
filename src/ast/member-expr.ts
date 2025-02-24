import { is } from "@/utils";
import { AstExpr } from "./node";
import { ObjectLiteral, Property } from "./object-literal";
import { AstLiteral, AstSymbolExpr, NullLiteral } from "./literal-expression";
import { Env } from "./env";

export class MemberExpr extends AstExpr{
  public name = 'Member Expression'
  constructor(
    public member: AstExpr,
    public property: string
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}
