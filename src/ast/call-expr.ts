import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr, AstNode, AstStmt, NullLiteral} from "./node";
import { Identifier } from "./literal-expression";
import { FunctionDeclStmt } from "./function-declaration-stmt";
import { FunctionExpr } from "./function-expr";
import { RETURN } from "@/constant";
import { ComputedExpr } from "./computed-expr";
import { MemberExpr } from "./member-expr";
import BUILT_IN from '@/ast/built-in';

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
    let maybeFn = null;
    if (is(this.method, ComputedExpr)) {
      maybeFn = this.method.eval(env);
    }
    if (is(this.method, MemberExpr)) {
      maybeFn = this.method.eval(env);
    }
    const fnName = maybeFnName;
    if (fnName in BUILT_IN){
      const build_in_functions = BUILT_IN as Record<string, any>;
      const args = this.argList.map(arg => arg.eval(scope));
      return build_in_functions[fnName](
        env,
        ...args
      );
    }
    const fn = !is(maybeFn, FunctionExpr) ? scope.lookup(fnName) : maybeFn;
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