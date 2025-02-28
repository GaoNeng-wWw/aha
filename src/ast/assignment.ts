import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode } from "./node";
import { Identifier } from "./literal-expression";

export class Assignment extends AstExpr {
  public name = 'Assignment'
  constructor(
    public identifier: AstExpr,
    public value: AstExpr
  ){
    super();
  }
  eval(env: Env): AstNode {
    if (!is(this.identifier, Identifier)){
      throw new Error(`Except Identifier but found ${this.name}`);
    }
    const id = this.identifier.val
    if (typeof id !== 'string'){
      throw new Error(`Except identifier name but found ${typeof id}`);
    }
    const value = this.value.eval(env);
    env.assign(id, this.value.eval(env));
    return value;
  }
}