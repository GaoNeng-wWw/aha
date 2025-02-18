import { BlockStmt } from "./block-stmt";
import { AstExpr, AstStmt } from "./node";

export class IfStmt extends AstStmt {
  public name = 'If Statement'
  constructor(
    public condition: AstExpr,
    public body: AstStmt,
    public elseBody: AstStmt
  ){
    super();
  }
}