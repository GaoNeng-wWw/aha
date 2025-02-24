import { ArrayLiteral } from "@/ast/array-literal";
import { CallExpr } from "@/ast/call-expr";
import { ComputedExpr } from "@/ast/computed-expr";
import { FunctionDeclStmt } from "@/ast/function-declaration-stmt";
import { AstNumberLiteral, AstBooleanLiteral, AstSymbolExpr, AstStringLiteral } from "@/ast/literal-expression";
import { AstExpr, AstStmt } from "@/ast/node";
import { ObjectLiteral, Property } from "@/ast/object-literal";
import { ParameterStmt } from "@/ast/parameter";
import { TokenKind, Token } from "@/lexer";

export const createToken = (kind: TokenKind): Token => new Token(kind, '');
export const createNumberLiteral = (value: number) => new AstNumberLiteral(value);
export const createBooleanLiteral = (val: boolean) => new AstBooleanLiteral(val.toString());
export const createStringLiteral = (val: string) => new AstStringLiteral(val);
export const createCall = (callee: string, args: AstExpr[]) => new CallExpr(
  new AstSymbolExpr(callee),
  args
)
export const createFn = (fnName: string, params: ParameterStmt[], body: AstStmt[]) => new FunctionDeclStmt(params, fnName, body)
export const createProperty = (key: string, value: AstExpr) => new Property(key, value);
export const createObject = (properties: Property[]) => new ObjectLiteral(properties);
export const createArray = (values: AstExpr[]) => new ArrayLiteral(values);