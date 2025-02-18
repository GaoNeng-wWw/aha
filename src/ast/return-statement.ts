import { AstExpr, AstStmt } from "./node";

export class ReturnStatement extends AstStmt{
  public name = 'Return Statement'
  constructor(
    public value: AstExpr
  ){
    super();
  }
}