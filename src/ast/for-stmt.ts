import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstStmt } from "./node";
import { Identifier } from "./literal-expression";
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
    return;
  }
}