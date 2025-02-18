import { charRules } from "./char-rule";
import { commenteRule } from "./comment";
import { identifierRule } from "./identifier";
import { spaceRule, numberLiteralRule, stringLiteralRule, booleanLiteralRule } from "./literal";

export default [spaceRule, commenteRule, numberLiteralRule,stringLiteralRule, booleanLiteralRule, ...charRules, identifierRule];