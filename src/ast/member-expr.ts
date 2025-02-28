import { AstExpr, AstNode } from "./node";
import { Env } from "./env";
import { is } from "@/utils";
import { Literal, Identifier, NullLiteral } from "./literal-expression";
import { ObjectLiteral, Property } from "./object-literal";

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
