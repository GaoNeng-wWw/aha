import { readFileSync, statSync } from "node:fs";
import { repl } from "./repl";
import { createProgram } from "@/utils/create";

(function (){
  const argv = process.argv;
  argv.shift();
  argv.shift();
  const command = argv.shift();
  if (!command) {
    repl();
    return;
  }
  switch (command) {
    case 'repl':
      return repl()
    default:
      const path = command;
      if (statSync(path).isFile()){
        const source = readFileSync(path);
        createProgram(source.toString());
        return;
      }
      repl();
  }
})();