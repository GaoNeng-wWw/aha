import { is } from "@/utils";
import { Env } from "./env";
import { AstLiteral } from "./literal-expression";
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
  eval(env: Env): AstExpr {
    env.insert(this.id, is(this.value, AstLiteral) ? this.value : this.value.eval(env));
    return this.value;
  }
}