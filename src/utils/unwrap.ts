import { Literal } from "@/ast/literal-expression";

export const unwrap = <T>(node: any):T => node.val