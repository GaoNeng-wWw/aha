import { AstNode, AstStmt } from "./node";

export class BlockStmt extends AstStmt {
  public name = 'Block Statement';
  constructor(
    public body: AstStmt[]
  ){
    super();
  }
  eval(): unknown {
    return;
  }
}