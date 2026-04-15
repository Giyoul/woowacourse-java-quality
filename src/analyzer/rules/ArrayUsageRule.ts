import { Rule } from './Rule';
import { Violation } from '../../types';
import { stripCommentsAndStrings } from './lineUtils';

export class ArrayUsageRule implements Rule {
  readonly ruleId = 'array-usage';
  readonly ruleName = '배열 사용 금지 (컬렉션 사용)';

  check(lines: string[], filePath: string): Violation[] {
    return lines.flatMap((line, index) => {
      const stripped = stripCommentsAndStrings(line);
      if (/\w+\s*\[\s*\]/.test(stripped) && !isMainMethodSignature(stripped)) {
        return [this.toViolation(filePath, index + 1, line.trim())];
      }
      return [];
    });
  }

  private toViolation(file: string, line: number, snippet: string): Violation {
    return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
  }
}

function isMainMethodSignature(code: string): boolean {
  return /\bpublic\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]/.test(code);
}
