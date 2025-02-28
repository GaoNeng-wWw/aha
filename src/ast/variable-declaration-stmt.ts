import { is } from "@/utils";
import { Env } from "./env";
import { Literal } from "./literal-expression";
import { AstExpr, AstStmt } from "./node";

export class VarDeclStmt extends AstStmt {
  public name = 'Variable Declaration Statement';
  constructor(
    public id:string,
    public isConst:boolean,
    public value: AstExpr,
  ){
    super();
  };
  eval(env: Env): unknown {
    return
  }
}