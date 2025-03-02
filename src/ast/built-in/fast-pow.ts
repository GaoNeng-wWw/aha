import { is } from "@/utils";
import { Env } from "../env";
import { AstNode } from "../node";
import { NumberLiteral } from "../literal-expression";

export const pow = (env: Env, ...nodes: AstNode[]) => {
  if (nodes.length < 2){
    throw new Error(`Too few parameters, expected two parameters, Too few parameters, expected two parameters, but received ${nodes.length} parameter`);
  }
  const [base,pow] = nodes;
  const baseNode = base.eval(env);
  const powNode = pow.eval(env);
  if (!is(baseNode, NumberLiteral) || !is(powNode, NumberLiteral)){
    throw new Error(
      `${is(baseNode, NumberLiteral) ? powNode : baseNode} is not number`
    )
  }
  let baseValue = baseNode.val;
  let powValue = powNode.val;
  let res = 1;
  while (powValue > 0){
    if (powValue & 1) {
      res *= baseValue;
    }
    baseValue *= baseValue;
    powValue >>= 1;
  }
  return new NumberLiteral(res);
}