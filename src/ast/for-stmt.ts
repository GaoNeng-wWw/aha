import { except, exceptMany, is, unwrap } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode, AstStmt, NullLiteral } from "./node";
import { Identifier, Literal } from "./literal-expression";
import { VarDeclStmt } from "./variable-declaration-stmt";
import { BreakStmt } from "./break-stmt";
import { BREAK, CONTINUE, RETURN } from "@/constant";
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
  eval(env: Env): AstNode {
    const scope = new Env(env);
    scope.define(BREAK, null);
    this.initializer.eval(scope);
    while (true){
      const condition = this.condition.eval(scope);
      exceptMany(condition, [Literal, NullLiteral])
      if (!unwrap<boolean>(condition)) {
        break;
      }
      for (const body of this.body) {
        body.eval(scope);
        if (scope.has(RETURN) && scope.lookup(RETURN)){
          return scope.lookup(RETURN);
        }
        if (scope.has(BREAK) && scope.lookup(BREAK)){
          scope.remove(BREAK);
          return new NullLiteral();
        }
      }
      this.incrementor.eval(scope);
    }
    return new NullLiteral();
  }
}