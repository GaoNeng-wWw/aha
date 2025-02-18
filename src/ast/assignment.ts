import { AstExpr } from "./node";

export class AstAssignment extends AstExpr {
  public name = 'Assignment'
  constructor(
    public identifier: AstExpr,
    public value: AstExpr
  ){
    super();
  }
  eval(): unknown {
    // todo: set env
    return ;
  }
}