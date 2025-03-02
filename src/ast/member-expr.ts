import { AstExpr, AstNode, NullLiteral } from "./node";
import { Env } from "./env";
import { is } from "@/utils";
import { ObjectLiteral, Property } from "./object-literal";

export class MemberExpr extends AstExpr{
  public name = 'Member Expression'
  constructor(
    public member: AstExpr,
    public property: string
  ){
    super();
  }
  eval(env: Env): AstNode {
    let member = this.member.eval(env);
    if (is(member, MemberExpr)) {
      return member.eval(env);
    }
    if (is(member, Property)){
      member = member.eval(env);
    }
    if (!is(member, ObjectLiteral)){
      throw new Error(`Except Object but found ${this.member.name}`);
    }
    return member.m.get(this.property)?.eval(env) ?? new NullLiteral();
  }
}
