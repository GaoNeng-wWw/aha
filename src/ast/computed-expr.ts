import { exceptMany, is, isMany, unwrap } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode, NullLiteral } from "./node";
import { ObjectLiteral } from "./object-literal";
import { ArrayLiteral, Identifier, Literal } from "./literal-expression";



export class ComputedExpr extends AstExpr {
  public name = 'Computed Expression';
  constructor(
    public member: AstExpr,
    public property: AstExpr
  ) {
    super();
  }
  eval(env: Env): AstNode{
    const literal = this.member.eval(env);
    if (!is(literal, ObjectLiteral) && !is(literal, ArrayLiteral)){
      throw new Error(`Except Object or array but found ${literal.name}`);
    }
    const maybeValidProperty = isMany(this.property, [Identifier, Literal]) ? this.property : this.property.eval(env);
    exceptMany(maybeValidProperty, [Identifier, Literal]);
    const property = maybeValidProperty as Identifier | Literal;
    let key:string | number  = '';
    if (is(property, Identifier)){
      const idRef = property.eval(env);
      if (!is(idRef, Literal)){
        throw new Error(`Except literal but found ${idRef.name}`);
      }
      key = unwrap<string | number>(idRef);
    }
    if (is(property, Literal)) {
      key = unwrap<string | number>(property);
    }
    if (is(literal, ObjectLiteral)){
      return literal.m.get(key)?.eval(env) ?? new NullLiteral();
    }
    if (is(literal, ArrayLiteral)){
      if (typeof key !== 'number'){
        throw new Error(`Array Index except number but found ${key}`)
      }
      const value = literal.contents[key];
      if (!value){
        return new NullLiteral();
      }
      return (is(value,Literal) ? value : value.eval(env))
    }
    return new NullLiteral();
  }
}