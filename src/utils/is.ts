type OR<T extends Clazz<unknown>[]> = T[number] extends Clazz<infer U> ? U : never;

export const is = <T>(value: unknown, clazz: new (...args: any[]) => T): value is T => value instanceof clazz;
export const isMany = <
  T,
  U extends Clazz<unknown>[] = Clazz<T>[]
>(value: unknown, clazz: U): value is OR<U> => clazz.some(clazz => value instanceof clazz);