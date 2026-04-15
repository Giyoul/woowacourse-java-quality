import { Rule } from './Rule';
import { Violation } from '../../types';
import { stripCommentsAndStrings } from './lineUtils';

export class TernaryOperatorRule implements Rule {
  readonly ruleId = 'ternary-operator';
  readonly ruleName = '3항 연산자 사용 금지';

  check(lines: string[], filePath: string): Violation[] {
    return lines.flatMap((line, index) => {
      const stripped = stripCommentsAndStrings(line);
      if (this.hasTernaryOperator(stripped)) {
        return [this.toViolation(filePath, index + 1, line.trim())];
      }
      return [];
    });
  }

  private hasTernaryOperator(code: string): boolean {
    return /\S\s*\?\s*\S.*:\s*\S/.test(code) && !/\?\s*(>|extends\b|super\b)/.test(code);
  }

  private toViolation(file: string, line: number, snippet: string): Violation {
    return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
  }
}
