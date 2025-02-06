import { describe, it, expect } from 'vitest';
import { identifierRule } from '../identifier';
import { Lexer, LexerError } from '../../lexer';

describe('identifier', () => {
  it('should create a token', () => {
    const lexer = new Lexer([identifierRule],'valid123');
    const tokens = lexer.run();
    expect(tokens).toHaveLength(2);
  });
  it('should not create a token for invalid identifiers', () => {
    const lexer = new Lexer([identifierRule],'123Invalid');
    expect(()=>lexer.run()).toThrow(LexerError);
  });
}); 