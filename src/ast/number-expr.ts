import { AstExpr } from "./node";

export class AstNumberLiteral extends AstExpr {
  public name = 'Number Literal';
  constructor(public val: number){
    super();
  }
  eval(){
    return this.val;
  }
}

export class AstBooleanLiteral extends AstExpr {
  public name = 'Boolean Literal';
  constructor(
    public val: string
  ){
    super();
  }
  eval(): string {
    return this.val;
  }
}

export class AstStringLiteral extends AstExpr {
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

export class AstSymbolExpr extends AstExpr {
  constructor(
    public val: string
  ){
    super();
  }
  eval(){
    return this.val;
  }
}

export class ArrayLiteral extends AstExpr {
  public name = 'Array Literal';
  constructor(
    public contents: AstExpr[]
  ){
    super();
  }
}

export class NullLiteral extends AstExpr{
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