import { isMany } from "@/utils";
import { Env } from "./env";
import { AstExpr } from "./node";
import { ObjectLiteral } from "./object-literal";

export class AstLiteral extends AstExpr {
  public name = 'Literal'
  constructor(){
    super()
  }
  eval(env: Env): unknown {
    return;
  }
}

export class AstNumberLiteral extends AstLiteral {
  public name = 'Number Literal';
  constructor(public val: number){
    super();
  }
  eval(){
    return this.val;
  }
}

export class AstBooleanLiteral extends AstLiteral {
  public name = 'Boolean Literal';
  constructor(
    public val: string
  ){
    super();
  }
  eval() {
    return JSON.parse(this.val);
  }
}

export class AstStringLiteral extends AstLiteral {
  public name = 'String Literal';
  constructor(
    public val: string
  ){
    super();
  }
  eval(): string {
    return this.val;
  }
}

export class AstSymbolExpr extends AstLiteral {
  constructor(
    public val: string
  ){
    super();
  }
  eval(env: Env){
    const maybeExp = env.lookup(this.val);
    if (isMany(maybeExp, [AstNumberLiteral,AstBooleanLiteral,AstStringLiteral,ArrayLiteral,ObjectLiteral])){
      return maybeExp.eval(env);
    }
    return maybeExp;
  }
}

export class ArrayLiteral extends AstLiteral {
  public name = 'Array Literal';
  constructor(
    public contents: AstExpr[]
  ){
    super();
  }
}

export class NullLiteral extends AstLiteral{
  public name = 'Null Literal';
  constructor(
    public val:string='null'
  ){
    super();
  }
  eval(): unknown {
    return this.val;
  }
}