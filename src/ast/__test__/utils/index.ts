import { AstNumberLiteral, AstBooleanLiteral } from "@/ast/literal-expression";
import { TokenKind, Token } from "@/lexer";

export const createToken = (kind: TokenKind): Token => new Token(kind, '');
export const createNumberLiteral = (value: number) => new AstNumberLiteral(value);
export const createBooleanLiteral = (val: boolean) => new AstBooleanLiteral(val.toString());
