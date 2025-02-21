import { Env } from "./env";

export class AstNode {
  eval(env: Env):unknown{
    return;
  }
}
export class AstStmt extends AstNode {
  constructor(){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}
export class AstExpr extends AstNode {
  constructor(){
    super();
  }
  eval(env: Env): unknown{
    return;
  }
}