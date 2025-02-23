import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { AstSymbolExpr } from "./literal-expression";
import { VarDeclStmt } from "./variable-declaration-stmt";
import { BreakStmt } from "./break-stmt";
import { BREAK, CONTINUE } from "@/constant";
import { ContinueStmt } from "./continue-stmt";
import { ReturnStatement } from "./return-statement";

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
    const forEnv = new Env(env);
    while (this.condition.eval(forEnv)) {
      for (const body of this.body){
        if (body instanceof BreakStmt){
          return;
        }
        if (body instanceof ContinueStmt){
          break;
        }
        if (body instanceof ReturnStatement){
          return body.eval(forEnv);
        }
        body.eval(forEnv);
        if (forEnv.has(BREAK)){
          forEnv.remove(BREAK);
          return;
        }
        if (forEnv.has(CONTINUE)){
          forEnv.remove(CONTINUE);
          break;
        }
      }
      this.incrementor.eval(forEnv);
    }
    return;
  }
}