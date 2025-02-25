import { AstExpr, AstNode } from "./node";
import { Env } from "./env";
import { is } from "@/utils";
import { AstLiteral, AstSymbolExpr, NullLiteral } from "./literal-expression";
import { ObjectLiteral, Property } from "./object-literal";

export class MemberExpr extends AstExpr{
  public name = 'Member Expression'
  constructor(
    public member: AstExpr,
    public property: string
  ){
    super();
  }
  private _eval(
    env:Env,
    member: AstExpr | null,
    property: string
  ): AstNode {
    let value = member;
    let key = property;
    if (is(value, AstLiteral)){
      return value;
    }
    if (is(value, Property)){
      return value.value;
    }
    if (is(value, MemberExpr)) {
      value = this._eval(env, value.eval(env), property);
      return value;
    }
    if (is(value, ObjectLiteral)){
      const id = property;
      let flag = true;
      for (const prop of value.properties){
        if (prop.id === id){
          value = prop.value;
          flag = false;
          break;
        }
      }
      if (flag){
        return new NullLiteral()
      }
      return value;
    }
    return value ? value : new NullLiteral()
  }
  eval(env: Env): AstExpr {
    return this._eval(env, this.member, this.property);
  }
}
