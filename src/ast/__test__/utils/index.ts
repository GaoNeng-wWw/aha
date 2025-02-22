import { CallExpr } from "@/ast/call-expr";
import { FunctionDeclStmt } from "@/ast/function-declaration-stmt";
import { AstNumberLiteral, AstBooleanLiteral, AstSymbolExpr } from "@/ast/literal-expression";
import { AstExpr, AstStmt } from "@/ast/node";
import { ParameterStmt } from "@/ast/parameter";
import { TokenKind, Token } from "@/lexer";

export const createToken = (kind: TokenKind): Token => new Token(kind, '');
export const createNumberLiteral = (value: number) => new AstNumberLiteral(value);
export const createBooleanLiteral = (val: boolean) => new AstBooleanLiteral(val.toString());
export const createCall = (callee: string, args: AstExpr[]) => new CallExpr(
  new AstSymbolExpr(callee),
  args
)
export const createFn = (fnName: string, params: ParameterStmt[], body: AstStmt[]) => new FunctionDeclStmt(params, fnName, body)