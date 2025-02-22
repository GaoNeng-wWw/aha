import { AstNode } from "./node";

export class Env {
  private env: Map<string, unknown>;
  constructor(
    private parent: Env | null=null
  ){
    this.env = new Map();
  }
  lookup(
    name: string,
    depth: number = -1,
  ): unknown | null{
    const val = this.env.get(name) ?? null;
    if (val !== null){
      return val ?? null;
    }
    return this.parent?.lookup(name, depth - 1) ?? null;
  }
  insert(
    name: string,
    node: unknown
  ){
    return this.env.set(name,node);
  }
  has(name: string, depth: number = 0):boolean {
    if (!this.parent || depth === 0){
      return this.env.has(name);
    }
    return this.env.has(name) ? true : this.parent?.has(name, depth - 1);
  }
}