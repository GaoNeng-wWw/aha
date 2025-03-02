import { is, isMany } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode, AstStmt, NullLiteral } from "./node";
import { AssertionError } from "assert";

export class Literal implements AstExpr {
  public name = 'Literal'
  public val: any;
  constructor(
  ){}
  eval(env: Env): AstNode {
    return new NullLiteral();
  }
}

export class NumberLiteral extends Literal {
  public name = 'Number Literal';
  constructor(public val: number){
    super();
  }
  eval(env:Env): NumberLiteral{
    return this;
  }
}

export class BooleanLiteral extends Literal {
  public name = 'Boolean Literal';
  public val: boolean;
  constructor(
    private _val: string
  ){
    super();
    this.val = JSON.parse(_val);
  }
  eval():BooleanLiteral {
    return this;
  }
}

export class StringLiteral extends Literal {
  public name = 'String Literal';
  constructor(
    public val: string
  ){
    super();
  }
  eval():StringLiteral {
    return this;
  }
}

export class Identifier extends AstExpr {
  constructor(
    public val: string
  ){
    super();
  }
  eval(env: Env):Literal | AstNode{
    const value = env.lookup(this.val);
    if (is(value, Literal)){
      return value;
    }
    if(!value){
      process.exit(-1);
    }
    return value.eval(env) as AstNode;
  }
}

export class ArrayLiteral extends AstStmt {
  public name = 'Array Literal';
  private _contents:AstNode[]
  constructor(
    public contents: AstExpr[]
  ){
    super();
    this._contents = Array.from({length: this.contents.length});
  }
  eval(env: Env): ArrayLiteral {
    for (let i=0;i<this.contents.length;i++){
      this._contents[i] = this.contents[i].eval(env)!;
    }
    return this;
  }
}