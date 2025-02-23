import { BREAK, CONTINUE } from "@/constant";
import { Env } from "./env";
import { AstStmt } from "./node";

export class ContinueStmt extends AstStmt {
  public name = 'ContinueStatement';
  constructor(){
    super();
  }
  eval(env: Env): unknown {
    env.insert(CONTINUE, true);
    return ;
  }
}