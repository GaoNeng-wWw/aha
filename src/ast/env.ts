export class Env {
  private env: Map<string, unknown>;
  constructor(
    public parent: Env | null=null
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
  private resolve(name: string): Env | undefined{
    return this.env.has(name) ? this : this.parent?.resolve(name);
  }
  insert(
    name: string,
    node: unknown
  ){
    // let env:Env|null = this;
    // while (env && !env.has(name)){
    //   env = env.parent;
    // }
    // if (env?.parent){
    //   return env.env.set(name, node);
    // }
    return this.env.set(name,node);
  }
  has(name: string, depth: number = 0):boolean {
    if (!this.parent || depth === 0){
      return this.env.has(name);
    }
    return this.env.has(name) ? true : this.parent?.has(name, depth - 1);
  }
  remove(name:string){
    if (this.has(name)){
      this.env.delete(name);
      return;
    }
    this.parent?.remove(name);
  }
  
  public get globalEnv() : Env {
    let env:Env = this;
    while (env.parent){
      env = env.parent;
    }
    return env;
  }
  
}