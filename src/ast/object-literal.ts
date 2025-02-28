import { Env } from "./env";
import { AstExpr } from "./node";

export class ObjectLiteral extends AstExpr {
  public name = 'ObjectLiteral';
  constructor(
    public properties: Property[]
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
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
    return;
  }
}