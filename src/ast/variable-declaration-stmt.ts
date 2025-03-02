import { is } from "@/utils";
import { Env } from "./env";
import { Literal } from "./literal-expression";
import { AstExpr, AstNode, AstStmt } from "./node";

export class VarDeclStmt extends AstStmt {
  public name = 'Variable Declaration Statement';
  constructor(
    public id:string,
    public isConst:boolean,
    public value: AstExpr,
  ){
    super();
  };
  eval(env: Env): AstNode {
    const value = is(this.value, Literal) ? this.value : this.value.eval(env);
    if (env.currentHas(this.id)){
      throw new Error(`Variable ${this.id} is already defined`)
    }
    env.define(this.id, value)
    return value;
  }
}