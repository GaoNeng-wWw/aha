import { describe, expect, it } from "vitest";
import { Lexer } from "../../lexer";
import { commenteRule } from "../comment";
import { stringLiteralRule } from "../literal";

describe('Lexer Rule - Comment', ()=>{
  it('Ignore subsequent parsing, even if there are unrecorded tokens, they will not be throw LexerError', ()=>{
    const lexer = new Lexer([commenteRule,stringLiteralRule], '// 1.this is comment');
    const tokens = lexer.run();
    expect(tokens).toHaveLength(1);
  })
})