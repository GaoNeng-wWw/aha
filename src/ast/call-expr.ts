import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode, NullLiteral} from "./node";
import { Identifier } from "./literal-expression";
import { FunctionDeclStmt } from "./function-declaration-stmt";
import { FunctionExpr } from "./function-expr";
import { RETURN } from "@/constant";

export class CallExpr extends AstExpr {
  public name = 'Call Expression'
  constructor(
    public method: AstExpr,
    public argList: AstExpr[]
  ){
    super();
  }
  eval(env:Env): AstNode {
    const scope = new Env(env);
    let maybeFnName='';
    if(is(this.method, Identifier)) {
      maybeFnName = this.method.val;
    }
    if (is(this.method, FunctionDeclStmt)) {
      maybeFnName= this.method.fnName;
    }
    const fnName = maybeFnName;
    const fn = scope.lookup(fnName);
    if (!is(fn, FunctionDeclStmt) && !is(fn,FunctionExpr)){
      throw new Error(`Except function but found ${fn.name}`);
    }
    for (let i=0;i<fn.params.length;i++){
      const {paramName} = fn.params[i];
      scope.define(paramName, this.argList[i].eval(scope));
    }
    env.define(RETURN, null);
    for (const body of fn.body){
      body.eval(scope)
      if (scope.lookup(RETURN) !== null){
        return scope.lookup(RETURN);
      }
    }
    return new NullLiteral();
  }
}