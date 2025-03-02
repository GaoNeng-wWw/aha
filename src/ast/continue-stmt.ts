import { CONTINUE } from "@/constant";
import { Env } from "./env";
import { AstNode, AstStmt, NullLiteral } from "./node";

export class ContinueStmt extends AstStmt {
  public name = 'ContinueStatement';
  constructor(){
    super();
  }
  eval(env: Env): AstNode {
    env.define(CONTINUE, new NullLiteral());
    return new NullLiteral();
  }
}