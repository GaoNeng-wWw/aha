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
}