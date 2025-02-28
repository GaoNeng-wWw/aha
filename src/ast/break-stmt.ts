import { BREAK } from "@/constant";
import { Env } from "./env";
import { AstStmt } from "./node";

export class BreakStmt extends AstStmt {
  public name = 'BreakStatement';
  constructor(){
    super();
  }
  eval(env: Env): unknown {
    return ;
  }
}