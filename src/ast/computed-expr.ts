  import { is } from "@/utils";
  import { Env } from "./env";
  import { AstExpr } from "./node";
  import { Literal, NumberLiteral, StringLiteral, NullLiteral, ArrayLiteral, Identifier } from "./literal-expression";
  import { ObjectLiteral, Property } from "./object-literal";


  export class ComputedExpr extends AstExpr {
    public name = 'Computed Expression';
    constructor(
      public member: AstExpr,
      public property: AstExpr
    ){
      super();
    }
    eval(env:Env): unknown {
      return;
    }
  }