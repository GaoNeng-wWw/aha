import { BREAK } from "@/constant";
import { Env } from "./env";
import { AstNode, AstStmt, NullLiteral } from "./node";
import { StringLiteral } from "./literal-expression";

export class BreakStmt extends AstStmt {
  public name = 'BreakStatement';
  constructor(){
    super();
  }
  eval(env: Env): AstNode {
    env.assign(BREAK, new StringLiteral(BREAK))
    return new NullLiteral();
  }
}