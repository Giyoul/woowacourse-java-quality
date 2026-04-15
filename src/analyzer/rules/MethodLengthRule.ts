import { Rule } from './Rule';
import { Violation } from '../../types';
import { stripCommentsAndStrings } from './lineUtils';

const MAX_METHOD_LINES = 10;
const METHOD_SIGNATURE_START = /^\s+(public|private|protected|static|\s)+[\w<>\[\]]+\s+\w+\s*\(/;
const METHOD_SIGNATURE_END = /\)\s*(throws\s+[\w,\s]+)?\s*\{/;

export class MethodLengthRule implements Rule {
  readonly ruleId = 'method-length';
  readonly ruleName = `메서드 길이 ${MAX_METHOD_LINES}줄 초과 금지`;

  check(lines: string[], filePath: string): Violation[] {
    const violations: Violation[] = [];
    let methodStartLine = -1;
    let braceDepth = 0;
    let methodBodyLines = 0;
    let insideMethod = false;
    let pendingMethodStart = false;

    lines.forEach((line, index) => {
      const stripped = stripCommentsAndStrings(line);

      if (!insideMethod && !pendingMethodStart && METHOD_SIGNATURE_START.test(line)) {
        pendingMethodStart = true;
        methodStartLine = index + 1;
        methodBodyLines = 0;
      }

      if (pendingMethodStart && METHOD_SIGNATURE_END.test(stripped)) {
        pendingMethodStart = false;
        insideMethod = true;
        braceDepth = 1;
        return;
      }

      if (!insideMethod) {
        return;
      }

      braceDepth += countBraces(stripped, '{') - countBraces(stripped, '}');
      if (braceDepth > 0) {
        methodBodyLines++;
      }
      if (braceDepth <= 0) {
        if (methodBodyLines > MAX_METHOD_LINES) {
          violations.push(this.toViolation(filePath, methodStartLine, lines[methodStartLine - 1].trim()));
        }
        insideMethod = false;
      }
    });

    return violations;
  }

  private toViolation(file: string, line: number, snippet: string): Violation {
    return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
  }
}

function countBraces(line: string, brace: '{' | '}'): number {
  const pattern = brace === '{' ? /\{/g : /\}/g;
  return (line.match(pattern) ?? []).length;
}
