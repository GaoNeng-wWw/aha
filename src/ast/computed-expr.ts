import { AstExpr } from "./node";

export class ComputedExpr extends AstExpr {
  public name = 'Computed Expression';
  constructor(
    public member: AstExpr,
    public property: AstExpr
  ){
    super();
  }
  eval(): unknown {
    return;
  }
}