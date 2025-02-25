import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode, AstStmt } from "./node";

export class AstLiteral extends AstExpr {
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
  eval():boolean {
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

export class AstSymbolExpr extends AstExpr {
  constructor(
    public val: string
  ){
    super();
  }
  eval(env: Env){
    const maybeExp = env.lookup(this.val);
    // if (isMany(maybeExp, [AstNumberLiteral,AstBooleanLiteral,AstStringLiteral,ArrayLiteral,ObjectLiteral])){
    //   return maybeExp.eval(env);
    // }
    return maybeExp;
  }
}

export class ArrayLiteral extends AstStmt {
  public name = 'Array Literal';
  constructor(
    public contents: AstExpr[]
  ){
    super();
  }
  eval(env: Env): AstNode[] {
    const contents = this.contents.map((content) => {
      if (is(content, AstLiteral)){
        if (is(content, AstStringLiteral)){
          return new AstStringLiteral(content.eval());
        }
        if (is(content, AstNumberLiteral)){
          return new AstNumberLiteral(content.eval());
        }
        if (is(content, AstBooleanLiteral)){
          return new AstBooleanLiteral(`${content.eval()}`);
        }
        if (is(content, ArrayLiteral)) {
          return new ArrayLiteral(content.eval(env) as AstNode[]);
        }
      }
      if (is(content, AstSymbolExpr)) {
        return content.eval(env) as AstNode;
      }
      return content;
    })
    return contents;
  }
}

export class NullLiteral extends AstLiteral{
  public name = 'Null Literal';
  constructor(
  ){
    super();
  }
  eval(): unknown {
    return 'null';
  }
}