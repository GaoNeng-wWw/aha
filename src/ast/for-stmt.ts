import { AstExpr, AstStmt } from "./node";

export class ForStatement extends AstStmt {
  public name = 'ForStatement'
  constructor(
    public initializer: AstExpr,
    public condition:AstExpr,
    public incrementor: AstExpr,
    public body: AstStmt[]
  ){
    super();
  }
}