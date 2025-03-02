import { AstNode } from "./node";

export class Env {
  public env: Map<string, AstNode | null>;
  constructor(
    public parent: Env | null=null
  ){
    this.env = new Map();
  }
  define(
    name: string,
    value: AstNode | null,
  ){
    this.env.set(name, value);
    return value;
  }
  assign(name: string, value: AstNode){
    const env = this.resolve(name);
    env.env.set(name, value)!;
    return value;
  }
  lookup(name: string){
    return this.resolve(name)!.env.get(name)!;
  }
  remove(name: string) {
    return this.resolve(name).env.delete(name)
  }
  currentHas(name: string): boolean{
    return this.env.has(name);
  }
  has(name: string):boolean{
    if(this.env.has(name)){
      return true;
    }
    if (!this.parent){
      return false;
    }
    return this.parent.has(name);
  }
  resolve(name: string):Env{
    if (this.env.has(name)){
      return this;
    }
    if (!this.parent){
      throw new Error(`Cannot resolve ${name}`);
    }
    return this.parent.resolve(name);
  }
}