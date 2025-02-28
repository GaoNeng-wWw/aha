import { is } from "@/utils";
import { getTokenName, Token, TokenKind } from "../lexer";
import { Env } from "./env";
import { BooleanLiteral, Literal, NumberLiteral } from "./literal-expression";
import { AstExpr, AstNode } from "./node";

export class BinaryExpr extends AstExpr {
  public name = 'Binary Expression'
  constructor(
    public l: AstExpr,
    public operator: Token,
    public r: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}