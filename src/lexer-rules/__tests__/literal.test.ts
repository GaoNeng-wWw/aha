import { describe, it, expect } from 'vitest';
import { Lexer, LexerError, TokenKind } from '../../lexer';
import rules, { booleanLiteralRule, numberLiteralRule, spaceRule } from '../literal';

describe('Lexer - Literal Rules', () => {
  it('should tokenize a string literal', () => {
    const input = '"hello"';
    const lexer = new Lexer(rules, input);
    const tokens = lexer.run();
    
    expect(tokens).toHaveLength(2);
    expect(tokens[0].kind).toBe(TokenKind.STRING);
    expect(tokens[0].value).toBe('hello');
    expect(tokens[1].kind).toBe(TokenKind.EOF);
  });

  it('should tokenize spaces', () => {
    const input = '   ';
    const lexer = new Lexer(rules, input);
    const tokens = lexer.run();
    
    expect(tokens).toHaveLength(1);
    expect(tokens[0].kind).toBe(TokenKind.EOF);
  });

  it('should tokenize mixed string and spaces', () => {
    const input = '   "hello"   ';
    const lexer = new Lexer(rules, input);
    const tokens = lexer.run();
    
    expect(tokens).toHaveLength(2);
    expect(tokens[0].kind).toBe(TokenKind.STRING);
    expect(tokens[0].value).toBe('hello');
    expect(tokens[1].kind).toBe(TokenKind.EOF);
  });

  it('should throw an error for unrecognized tokens', () => {
    const input = 'hello';
    const lexer = new Lexer(rules, input);
    
    expect(() => lexer.run()).toThrowError('ERR Lexer: unrecognized token near hello');
  });
  it('should tokenize number (int)', ()=>{
    const input = '123';
    const lexer = new Lexer([numberLiteralRule], input);
    const tokens = lexer.run();
    expect(tokens).toHaveLength(2);
    expect(tokens[0].value).toBe('123');
  })
  it('should tokenize number (float)', ()=>{
    const input = '123.456';
    const lexer = new Lexer([numberLiteralRule], input);
    const tokens = lexer.run();
    expect(tokens).toHaveLength(2);
    expect(tokens[0].value).toBe('123.456');
  })
  it('should throw an error for unrecognized tokens (int.string)', () => {
    const input = '123.hello';
    const lexer = new Lexer([numberLiteralRule], input);
    
    expect(() => lexer.run()).toThrowError('ERR Lexer: unrecognized token near .hello');
  });
  it('should tokenize miexd number and space', ()=>{
    const input = '  123  ';
    const lexer = new Lexer([spaceRule,numberLiteralRule], input);
    const tokens = lexer.run();
    expect(tokens).toHaveLength(2);
    expect(tokens[0].value).toBe('123');
  })
  it('should tokenize boolean', ()=>{
    const input = 'true';
    const lexer = new Lexer([booleanLiteralRule], input);
    const input2 = 'false';
    const lexer2 = new Lexer([booleanLiteralRule], input2);
    const tokens = lexer.run();
    const t2 = lexer2.run()
    expect(tokens).toHaveLength(2);
    expect(t2).toHaveLength(2);
    expect(tokens[0].value).toBe('true');
    expect(t2[0].value).toBe('false');
  })
});