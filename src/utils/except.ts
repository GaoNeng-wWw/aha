import { is } from "./is";

export const except = (val: unknown, clazz: Clazz<any>, errMessage?:string) => {
  if (!is(val, clazz)){
    throw new Error(errMessage ?? `Except ${clazz.name} but found ${val}`);
  }
}