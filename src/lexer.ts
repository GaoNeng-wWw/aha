export enum TokenKind {
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
  SLASH,         // /
  STAR,          // *
  PERCENT,       // %

  // KEYWORD
  LET,
  FUNCTION,
  IF,
  ELSE,
  FOR,
  WHILE,
  RETURN,
  NULL,
  BREAK,
  CONTINUE,
  CONST
}


export class Token {
  constructor(
    public kind: TokenKind,
    public value: string,
  ) { }
  isOne(kind: TokenKind) {
    return this.kind === kind;
  }
  isMany(...kinds: TokenKind[]) {
    return kinds.some((k) => k === this.kind);
  }
}
export type LexerRuleHandle = (param: { lexer: Lexer, pattern: RegExp, match: RegExpMatchArray, reminder: string }) => void;
export type LexerRule = [RegExp, LexerRuleHandle];
export class LexerError extends Error {
  constructor(message: string) {
    super(`ERR Lexer: ${message}`);
  }
}
export const getTokenName = (tokenKind: TokenKind) => TokenKind[tokenKind].toLowerCase();
export class Lexer {
  public pos: number;
  public tokens: Token[]
  public cursor: number;
  constructor(
    public rules: LexerRule[],
    public input: string
  ) {
    this.pos = 0;
    this.cursor = 0;
    this.tokens = [];
  }
  run() {
    while (!this.isEof()) {
      let matched = false;
      for (const [pattern, handle] of this.rules) {
        const match = pattern.exec(this.reminder());
        if (!match) {
          continue;
        }
        matched = true;
        handle({ lexer: this, pattern, match, reminder: this.reminder() })
        break;
      }
      if (!matched) {
        throw new LexerError(`unrecognized token near ${this.reminder()}`);
      }
    }
    this.tokens.push(this.createToken(TokenKind.EOF, 'EOF'));
    return this.tokens;
  }
  push(token: Token) {
    this.tokens.push(token);
    return;
  }
  createToken(kind: TokenKind, value: string) {
    return new Token(kind, value);
  }
  reminder() {
    return this.input.slice(this.pos);
  }
  advance() {
    this.advanceN(1);
  }
  advanceN(n: number) {
    this.pos += n;
  }
  isEof() {
    return this.pos >= this.input.length;
  }
}