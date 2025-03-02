import { is } from "@/utils";
import { Env } from "../env";
import { AstNode, NullLiteral } from "../node";
import { Identifier, Literal } from "../literal-expression";

export const show = (env:Env, ...nodes:AstNode[]): NullLiteral => {
  for (const node of nodes){
    if (is(node, Identifier)){
      const value = node.eval(env);
      if (is(value, Literal)){
        console.log(value.val)
        continue;
      }
      if (is(value, NullLiteral)){
        console.log(null);
        continue;
      }
    }
    if (is(node, Literal)){
      console.log(node.val)
      continue;
    }
    if (is(node, NullLiteral)){
      console.log(null);
      continue;
    }
    console.log(`[[${node.name}]]`);
  }
  return new NullLiteral();
}