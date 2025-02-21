import { AstNode } from "./node";

export class Env {
  private env: Map<string, unknown>;
  constructor(
    private parnet: Env | null
  ){
    this.env = new Map();
  }
  lookup(
    name: string,
    depth: number = -1,
  ): unknown | null{
    const val = this.env.get(name);
    if (val || depth){
      return val ?? null;
    }
    return this.parnet?.lookup(name, depth - 1) ?? null;
  }
  insert(
    name: string,
    node: unknown
  ){
    return this.env.set(name,node);
  }
  has(name: string, depth: number = 0):boolean {
    if (!this.parnet || depth === 0){
      return this.env.has(name);
    }
    return this.env.has(name) ? true : this.parnet?.has(name, depth - 1);
  }
}