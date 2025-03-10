import { Env } from "./env";
import { AstStmt } from "./node";
import { ParameterStmt } from "./parameter";

export class FunctionDeclStmt extends AstStmt {
  public name = 'Function Declaration Statement'
  constructor(
    public params: ParameterStmt[],
    public fnName: string,
    public body: AstStmt[]
  ){
    super();
  }
  eval(env: Env): FunctionDeclStmt {
    env.define(this.fnName, this);
    return this;
  }
}