import { Env } from "./env";
export interface AstNode {
  name: string,
  eval(env:Env): unknown;
}

export class AstStmt implements AstNode {
  public name = 'Statement';
  constructor(){}
  eval(env: Env): AstNode{
    return new NullLiteral();
  }
}
export class AstExpr implements AstNode {
  public name = 'Expression';
  constructor(){}
  eval(env: Env): AstNode{
    return new NullLiteral();
  }
}

export class NullLiteral{
  public name = 'Null Literal';
  public val = 'null'
  constructor(){}
  eval(env:Env) {
    return this;
  }
}