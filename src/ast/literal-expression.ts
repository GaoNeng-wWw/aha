import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode, AstStmt } from "./node";

export class Literal extends AstExpr {
  public name = 'Literal'
  public val: unknown
  constructor(
  ){
    super()
  }
  eval(env: Env): unknown{
    return;
  }
}

export class NumberLiteral extends Literal {
  public name = 'Number Literal';
  constructor(public val: number){
    super();
  }
  eval(){
    return
  }
}

export class BooleanLiteral extends Literal {
  public name = 'Boolean Literal';
  constructor(
    public val: string
  ){
    super();
  }
  eval():unknown {
    return;
  }
}

export class StringLiteral extends Literal {
  public name = 'String Literal';
  constructor(
    public val: string
  ){
    super();
  }
  eval():unknown {
    return;
  }
}

export class Identifier extends AstExpr {
  constructor(
    public val: string
  ){
    super();
  }
  eval(env: Env){
    return;
  }
}

export class ArrayLiteral extends AstStmt {
  public name = 'Array Literal';
  constructor(
    public contents: AstExpr[]
  ){
    super();
  }
  eval(env: Env): unknown {
    return;
  }
}

export class NullLiteral extends Literal{
  public name = 'Null Literal';
  constructor(
  ){
    super();
  }
  eval(): unknown {
    return 'null';
  }
}