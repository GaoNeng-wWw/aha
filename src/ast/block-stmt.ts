import { Env } from "./env";
import { AstStmt } from "./node";

export class BlockStmt extends AstStmt {
  public name = 'Block Statement';
  constructor(
    public body: AstStmt[]
  ){
    super();
  }
  eval(env: Env): unknown {
    return this.body.forEach(stmt => stmt.eval(env));
  }
}