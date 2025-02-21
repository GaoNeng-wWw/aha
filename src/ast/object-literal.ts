import { AstExpr } from "./node";

export class ObjectLiteral extends AstExpr {
  public name = 'ObjectLiteral';
  constructor(
    public properties: Property[]
  ){
    super();
  }
}

export class Property extends AstExpr {
  public name = 'PropertyExpression'
  constructor(
    public id:string,
    public vaule: AstExpr
  ){
    super();
  }
}