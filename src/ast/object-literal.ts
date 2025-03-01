import { is } from "@/utils";
import { Env } from "./env";
import { Identifier } from "./literal-expression";
import { AstExpr, AstNode } from "./node";

export class ObjectLiteral extends AstExpr {
  public m: Map<string|number, Property>
  public name = 'ObjectLiteral';
  constructor(
    private properties: Property[]
  ){
    super();
    this.m = new Map();
    for (const prop of properties){
      this.m.set(prop.id, prop);
    }
  }
  eval(env: Env) {
    this.properties.forEach(prop => prop.eval(env))
    return this;
  }
}

export class Property extends AstExpr {
  public name = 'PropertyExpression'
  constructor(
    public id:string,
    public value: AstNode
  ){
    super();
  }
  eval(env: Env) {
    this.value = is(this.value, Identifier) ? this.value.eval(env) : this.value;
    return this.value;
  }
}