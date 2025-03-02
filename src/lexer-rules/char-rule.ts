import { LexerRule, LexerRuleHandle, TokenKind } from "../lexer";

export const defaultHandle = (kind: TokenKind, value: string): LexerRuleHandle => {
  return ({lexer,match})=>{
    const val = match[0];
    lexer.advanceN(val.length);
    const token = lexer.createToken(kind, value);
    lexer.push(token);
  }
}

const charTokens:[RegExp, TokenKind,string][] = [
  [/^\[/, TokenKind.OPEN_BRACKET, '['],
  [/^\]/, TokenKind.CLOSE_BRACKET, ']'],
  [/^\{/, TokenKind.OPEN_CURLY, '{'],
  [/^\}/, TokenKind.CLOSE_CURLY, '}'],
  [/^\(/, TokenKind.OPEN_PAREN, '('],
  [/^\)/, TokenKind.CLOSE_PAREN, ')'],
  [/^<-/,TokenKind.ASSIGNMENT,'<-'],
  [/^==/,TokenKind.EQUALS,'=='],
  [/^\!\=/,TokenKind.NOT_EQUALS,'!='],
  [/^\!/,TokenKind.NOT,'!'],
  [/^<=/,TokenKind.LTE,'<='],
  [/^>=/,TokenKind.GTE,'>='],
  [/^</,TokenKind.LT,'<'],
  [/^>/,TokenKind.GT,'>'],
  [/^\&\&/, TokenKind.LOGIC_AND,'&&'],
  [/^\|\|/, TokenKind.LOGIC_OR,'||'],
  [/^\&/, TokenKind.AND,'&'],
  [/^\|/, TokenKind.OR,'|'],
  [/^\./, TokenKind.DOT,'.'],
  [/^\;/, TokenKind.SEMI,';'],
  [/^\:/, TokenKind.COLON,':'],
  [/^\,/, TokenKind.COMMA,','],
  [/^\+/, TokenKind.PLUS,'+'],
  [/^\-/, TokenKind.DASH,'-'],
  [/^\//, TokenKind.SLASH,'/'],
  [/^\*/, TokenKind.STAR,'*'],
  [/^\%/, TokenKind.PERCENT,'%'],
  [/^let/, TokenKind.LET, 'let'],
  [/^fn/,TokenKind.FUNCTION, 'fn'],
  [/^if/,TokenKind.IF,'if'],
  [/^else/, TokenKind.ELSE, 'else'],
  [/^for/, TokenKind.FOR, 'for'],
  [/^while/, TokenKind.WHILE, 'while'],
  [/^return/, TokenKind.RETURN, 'return'],
  [/^null/, TokenKind.NULL, 'null'],
  [/^break/, TokenKind.BREAK, 'break'],
  [/^continue/, TokenKind.CONTINUE, 'continue']
];

export const charRules:LexerRule[] = charTokens.map(
  (
    [reg,kind,value]
  ) => {
    return [reg, defaultHandle(kind, value)]
  }
)