import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr } from "./node";
import { AstLiteral, AstSymbolExpr } from "./literal-expression";

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
    const value = is(this.value, AstLiteral) ? this.value : this.value.eval(env);
    env.insert(id.val,value);
    return value
  }
}