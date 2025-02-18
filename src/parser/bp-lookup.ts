import { AstExpr } from "../ast/node";
import { TokenKind } from "../lexer";
import { Parser } from "./parser";

export const enum BP {
  DEFAULT_BP,
	COMMA,
	ASSIGNMENT,
	LOGICAL,
	RELATIONAL,
	ADDITIVE,
	MULTIPLICATIVE,
	UNARY,
	CALL,
	MEMBER,
	PRIMAR,
}