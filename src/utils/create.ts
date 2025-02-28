import { ArrayLiteral } from "@/ast/literal-expression";
import { CallExpr } from "@/ast/call-expr";
import { FunctionDeclStmt } from "@/ast/function-declaration-stmt";
import { NumberLiteral, BooleanLiteral, Identifier, StringLiteral } from "@/ast/literal-expression";
import { AstExpr, AstStmt } from "@/ast/node";
import { ObjectLiteral, Property } from "@/ast/object-literal";
import { ParameterStmt } from "@/ast/parameter";
import { TokenKind, Token } from "@/lexer";

export const createToken = (kind: TokenKind): Token => new Token(kind, '');
export const createNumberLiteral = (value: number) => new NumberLiteral(value);
export const createBooleanLiteral = (val: boolean) => new BooleanLiteral(val.toString());
export const createStringLiteral = (val: string) => new StringLiteral(val);
export const createCall = (callee: string, args: AstExpr[]) => new CallExpr(
  new Identifier(callee),
  args
)
export const createFn = (fnName: string, params: ParameterStmt[], body: AstStmt[]) => new FunctionDeclStmt(params, fnName, body)
export const createProperty = (key: string, value: AstExpr) => new Property(key, value);
export const createObject = (properties: Property[]) => new ObjectLiteral(properties);
export const createArray = (values: AstExpr[]) => new ArrayLiteral(values);
