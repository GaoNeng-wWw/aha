  import { is } from "@/utils";
  import { Env } from "./env";
  import { AstExpr } from "./node";
  import { AstLiteral, AstNumberLiteral, AstStringLiteral, NullLiteral, ArrayLiteral, AstSymbolExpr } from "./literal-expression";
  import { ObjectLiteral, Property } from "./object-literal";


  export class ComputedExpr extends AstExpr {
    public name = 'Computed Expression';
    constructor(
      public member: AstExpr,
      public property: AstExpr
    ){
      super();
    }
    private _eval(env:Env, object: AstExpr, property: AstExpr): AstExpr{
      let value = object;
      let key = property;
      if (is(value, AstLiteral)){
        return value;
      }
      if (is(value, Property)){
        return value.value;
      }
      if (is(value, ObjectLiteral)) {
        const id = key.eval(env);
        if (!is(key, AstStringLiteral)){
          throw new Error(`Key except string type but find ${key.name}`);
        }
        let flag = true;
        for (const prop of value.properties) {
          if (prop.id === id){
            value = prop.value;
            flag = false;
            break;
          }
        }
        if (flag){
          return new NullLiteral()
        }
        return value;
      }
      if (is(value, ArrayLiteral)) {
        const idx = key.eval(env);
        if (is(idx, AstNumberLiteral)){
          value = value.contents[idx.eval()] ?? new NullLiteral();
          return value;
        }
        if (typeof idx === 'number') {
          value = value.contents[idx] ?? new NullLiteral();
          return value;
        }
        if (typeof idx !== 'number'){
          throw new Error(`Index type except number but found ${typeof idx}`);
        }
      }
      if (is(value, ComputedExpr)) {
        value = this._eval(env, value.eval(env), key);
        return value
      }
      return new NullLiteral()
    }
    eval(env:Env): AstExpr {
      return this._eval(env, this.member, this.property); 
    }
  }