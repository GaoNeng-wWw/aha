import { RETURN } from "@/constant";
import { Env } from "./env";
import { AstNode, AstStmt, NullLiteral } from "./node";

export class BlockStmt extends AstStmt {
  public name = 'Block Statement';
  constructor(
    public body: AstStmt[]
  ){
    super();
  }
  eval(env: Env): AstNode {
    for (const body of this.body){
      body.eval(env);
    }
    return new NullLiteral();
  }
}