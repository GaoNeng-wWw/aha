import { Literal } from "@/ast/literal-expression";
import { is } from "./is";
import { NullLiteral } from "@/ast/node";

export const unwrap = <T>(node: any):T => is(node,Literal) || is(node, NullLiteral) ? node.val : node;