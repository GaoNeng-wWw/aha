import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr } from "./node";
import { AstSymbolExpr } from "./literal-expression";

export class AstAssignment extends AstExpr {
  public name = 'Assignment'
  constructor(
    public identifier: AstExpr,
    public value: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    if (!is(this.identifier, AstSymbolExpr)){
      throw new Error('Invalid assignment target');
    }
    const id = this.identifier;
    const value = this.value.eval(env);
    env.insert(id.val,value);
    return value
  }
}