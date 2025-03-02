# aha.ts

aha.ts is tiny language (base on Tree traversal interpreter)

## Front

Used Regexp to split token, and used Pratt Parseing

## Backend (aka. Runtime)

Used Tree traversal interpreter (But there is no room for optimization)

## Feature

1. Variable
2. If...Else
3. For loop
4. function definition
5. function call
   -  Self recursion
6. Object
7. Array

## Sytax

### Variable Definition

```
let x <- expr;
```

### If...else

```
if (condition) {
  ... thenable
} else {
  ... elseable
}
```

### Function

```
fn identifier(args...){
  body;
}
```

### Function Call

```
fn fib(x) {
  if (x == 0){
    return 0;
  }
  if (x == 1){
    return 1;
  }
  return fib(x-1) + fib(x-2);
}
show(fib(15));
```

### Object

```
let obj <- {
  foo: "baz"
};
let x <- foo.baz;
show(x); // "baz"
```

### Array

```
let arr <- [1,2,3];
let x <- arr[0]; // 1
```

## Example

[example](./example/README.md)