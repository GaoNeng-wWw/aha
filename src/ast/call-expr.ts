import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr} from "./node";
import { Literal, Identifier, NullLiteral } from "./literal-expression";
import { FunctionDeclStmt } from "./function-declaration-stmt";
import { FunctionExpr } from "./function-expr";
import { BREAK, RETURN } from "@/constant";

export class CallExpr extends AstExpr {
  public name = 'Call Expression'
  constructor(
    public method: AstExpr,
    public argList: AstExpr[]
  ){
    super();
  }
  eval(env:Env): unknown {
    return;
  }
}