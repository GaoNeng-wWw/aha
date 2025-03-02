import { Env } from '@/ast/env';
import lexerRules from '@/lexer-rules';
import { createProgram } from '@/program';
import { createInterface } from 'node:readline';
export const repl = () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  })
  let env = new Env();
  rl.prompt()
  rl.on('line', (line)=>{
    try {
      createProgram(line, lexerRules, env);
    } catch (e) {
      const err = e as Error;
      console.log(err.message);
    } finally {
      rl.prompt()
    }
  })
}