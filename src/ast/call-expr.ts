import { is } from "@/utils";
import { Env } from "./env";
import { AstExpr} from "./node";
import { AstLiteral, AstSymbolExpr, NullLiteral } from "./literal-expression";
import { FunctionDeclStmt } from "./function-declaration-stmt";
import { FunctionExpr } from "./function-expr";
import { BREAK, RETURN } from "@/constant";

export class CallExpr extends AstExpr {
  public name = 'Call Expression'
  constructor(
    public method: AstExpr,
    public argList: AstExpr[]
  ){
    super();
  }
  eval(env:Env): AstExpr {
    if (!is(this.method, AstSymbolExpr)){
      throw new Error(`Except identifier, but found ${this.method.name}`)
    }
    const fnName = this.method.val;
    const fn = env.lookup(fnName,-1);
    if (!is(fn, FunctionDeclStmt) && !is(fn, FunctionExpr)){
      throw new Error(`${fnName} is not function`);
    }
    const fnEnv = new Env(env);
    if (this.argList.length > fn.params.length) {
      throw new Error(`Too many arguments, function requires ${fn.params.length} arguments, but received ${this.argList.length}`);
    }
    if (this.argList.length < fn.params.length) {
      throw new Error(`Too few arguments, function requires ${fn.params.length} arguments, but received ${this.argList.length}`);
    }
    const args = this.argList.map((arg) => is(arg, AstLiteral) ? arg : arg.eval(fnEnv));
    for (let i=0;i<fn.params.length;i++){
      const name = fn.params[i].paramName;
      fnEnv.insert(name, args[i]);
    }
    const body = fn.body;

    for (const stmt of body) {
      stmt.eval(fnEnv);
      if (fnEnv.has(RETURN) || fnEnv.globalEnv.has(RETURN)){
        const val = fnEnv.globalEnv.lookup(RETURN) as AstExpr | null;
        fnEnv.remove(RETURN);
        fnEnv.globalEnv.remove(RETURN);
        return val ? val : new NullLiteral();
      }
    }
    return new NullLiteral();
  }
}