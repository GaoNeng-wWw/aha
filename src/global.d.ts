export {};

declare global {
  declare type Clazz<T> = new (...args: any[]) => T;
}
