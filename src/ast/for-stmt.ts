import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { AstSymbolExpr } from "./literal-expression";
import { VarDeclStmt } from "./variable-declaration-stmt";
import { BreakStmt } from "./break-stmt";
import { BREAK, CONTINUE } from "@/constant";
import { ContinueStmt } from "./continue-stmt";

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
      for (const body of this.body){
        if (body instanceof BreakStmt){
          return;
        }
        if (body instanceof ContinueStmt){
          break;
        }
        body.eval(env);
        if (env.has(BREAK)){
          env.remove(BREAK);
          return;
        }
        if (env.has(CONTINUE)){
          env.remove(CONTINUE);
          break;
        }
      }
      this.incrementor.eval(env);
    }
    return;
  }
}