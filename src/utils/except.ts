import { is } from "./is";

export const except = (val: unknown, clazz: Clazz<any>, errMessage?:string) => {
  if (!is(val, clazz)){
    throw new Error(errMessage ?? `Except ${clazz.name} but found ${val}`);
  }
}
export const exceptMany = (val: unknown, clazz: Clazz<any>[], errMessage?: string) => {
  for (const clzz of clazz) {
    if (val instanceof clzz){
      return ;
    }
  }
  const clzzNames = clazz.map(clzz => clzz.name).join(' or ');
  throw new Error(errMessage ?? `Except ${clzzNames} but found ${typeof val}`);
}