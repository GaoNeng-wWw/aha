import { Env } from "./env";
import { AstExpr } from "./node";

export class ObjectLiteral extends AstExpr {
  public name = 'ObjectLiteral';
  constructor(
    public properties: Property[]
  ){
    super();
    const m = new Map();
    for(const property of properties) {
      m.set(property.id, property);
    }
    this.properties = [...m.values()]
  }
  eval(env: Env): unknown {
    return this;
  }
}

export class Property extends AstExpr {
  public name = 'PropertyExpression'
  constructor(
    public id:string,
    public value: AstExpr
  ){
    super();
  }
  eval(env: Env) {
    return this.value.eval(env);
  }
}