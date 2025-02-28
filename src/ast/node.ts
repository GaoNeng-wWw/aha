import { Env } from "./env";

export class AstNode {
  public name = '';
  eval(env: Env):unknown{
    return;
  }
}
export class AstStmt extends AstNode {
  public name = 'Statement';
  constructor(){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}
export class AstExpr extends AstNode {
  public name = 'Expression';
  constructor(){
    super();
  }
  eval(env: Env): unknown{
    return;
  }
}