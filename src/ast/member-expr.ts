import { AstExpr } from "./node";

export class MemberExpr extends AstExpr{
  public name = 'Member Expression'
  constructor(
    public member: AstExpr,
    public property: string
  ){
    super();
  }
  eval(): unknown {
    return ;
  }
}