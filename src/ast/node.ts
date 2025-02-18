export class AstNode {
  eval():unknown{
    return;
  }
}
export class AstStmt extends AstNode {
  constructor(){
    super();
  }
}
export class AstExpr extends AstNode {
}