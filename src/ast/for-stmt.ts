import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { AstSymbolExpr } from "./literal-expression";
import { VarDeclStmt } from "./variable-declaration-stmt";

export class ForStatement extends AstStmt {
  public name = 'ForStatement'
  constructor(
    public initializer: AstExpr,
    public condition:AstExpr,
    public incrementor: AstExpr,
    public body: AstStmt[]
  ){
    super();
  }
  eval(env: Env): unknown {
    let maybeValidInitializer = '';
    if (is(this.initializer, VarDeclStmt)) {
      this.initializer.eval(env);
      maybeValidInitializer = this.initializer.id;
    } else if (is(this.initializer, AstSymbolExpr)) {
      maybeValidInitializer = this.initializer.val;
    } else {
      throw new Error(`Invalid initializer: ${this.initializer.eval(env)}`);

    }
    while (this.condition.eval(env)) {
      this.body.forEach(body => body.eval(env));
      this.incrementor.eval(env);
    }
    return;
  }
}