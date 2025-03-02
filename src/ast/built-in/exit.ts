import { is } from "@/utils";
import { Env } from "../env";
import { AstNode } from "../node";
import { NumberLiteral } from "../literal-expression";

export const exit = (env:Env, ...nodes: AstNode[]) => {
  const [code] = nodes;
  const val = code ? code.eval(env) : 0;
  process.exit(is(val, NumberLiteral) ? val.val : 0);
}