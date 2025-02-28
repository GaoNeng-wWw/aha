import { is } from "@/utils";
import { getTokenName, Token, TokenKind } from "../lexer";
import { Env } from "./env";
import { AstExpr, AstNode } from "./node";
import { BooleanLiteral, Literal, NumberLiteral, Identifier } from "./literal-expression";

export class PrefixExpr extends AstExpr {
  public name = 'Prefix Expression'
  constructor(
    public operator: Token,
    public rhs: AstExpr
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}