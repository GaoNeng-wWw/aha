import { except, is, unwrap } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode, AstStmt, NullLiteral } from "./node";
import { BooleanLiteral, Literal } from "./literal-expression";

export class IfStmt extends AstStmt {
  public name = 'If Statement'
  constructor(
    public condition: AstExpr,
    public body: AstStmt,
    public elseBody: AstStmt
  ){
    super();
  }
  eval(env: Env): AstNode {
    const status = this.condition.eval(env);
    except(status, Literal);
    if (unwrap(status)){
      return this.body.eval(env);
    }
    return this.elseBody.eval(env);
  }
}