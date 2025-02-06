export const enum TokenKind {
  EOF,
  STRING,
  NUMBER,
  BOOLEAN,
  IDENTIFIER,

  // GROUPING
  OPEN_BRACKET,  // [
  CLOSE_BRACKET, // ]
  OPEN_CURLY,    // {
  CLOSE_CURLY,   // }
  OPEN_PAREN,    // (
  CLOSE_PAREN,   // )

  // EQUIVILANCE
  ASSIGNMENT,    // =
  EQUALS,        // ==
  NOT_EQUALS,    // !=
  NOT,           // !

  // CONDITION
  LT,            // <
  LTE,           // <=
  GT,            // >
  GTE,           // >=

  // LOGIC
  AND,           // &
  OR,            // |
  LOGIC_AND,     // &&
  LOGIC_OR,      // ||

  // SYMBOLS
  DOT,           // .
  SEMI,          // ;
  COLON,         // :
  COMMA,         // ,

  // MATH
  PLUS,          // +
  DASH,          // -
  SLAST,         // /
  STAR,          // *
  PERCENT,       // %

  // KEYWORD
  CONST,
  FUNCTION,
  IF,
  ELSE,
  FOR,
  WHILE,
  RETURN
}


export class Token<T> {
  constructor(
    public kind: T,
    public value: string,
  ){}
}
export type LexerRuleHandle = (param:{lexer:Lexer,pattern:RegExp,match:RegExpMatchArray, reminder: string}) => void;
export type LexerRule = [RegExp, LexerRuleHandle];
export class LexerError extends Error {
  constructor(message:string) {
    super(`ERR Lexer: ${message}`);
  }
}
export class Lexer {
  private pos: number;
  private tokens: Token<TokenKind>[]
  constructor(
    public rules: LexerRule[],
    public input: string
  ){
    this.pos = 0;
    this.tokens = [];
  }
  run(){
    while (!this.isEof()){
      let matched = false;
      for (const [pattern, handle] of this.rules){
        const match = pattern.exec(this.reminder());
        if (!match){
          continue;
        }
        matched = true;
        handle({lexer:this, pattern, match, reminder:this.reminder()})
        break;
      }
      if (!matched){
        throw new LexerError(`unrecognized token near ${this.reminder()}`);
      }
    }
    this.tokens.push(this.createToken(TokenKind.EOF,'EOF'));
    return this.tokens;
  }
  push(token: Token<TokenKind>){
    this.tokens.push(token);
    return;
  }
  createToken(kind:TokenKind, value: string){
    return new Token(kind, value);
  }
  reminder(){
    return this.input.slice(this.pos);
  }
  advance(){
    this.advanceN(1);
  }
  advanceN(n: number){
    this.pos += n;
  }
  isEof(){
    return this.pos >= this.input.length;
  }
}