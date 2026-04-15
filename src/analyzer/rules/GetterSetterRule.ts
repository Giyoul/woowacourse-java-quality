import { Rule } from './Rule';
import { Violation } from '../../types';
import { stripCommentsAndStrings } from './lineUtils';

export class GetterSetterRule implements Rule {
  readonly ruleId = 'setter';
  readonly ruleName = 'setter 사용 금지';

  check(lines: string[], filePath: string): Violation[] {
    return lines.flatMap((line, index) => {
      const stripped = stripCommentsAndStrings(line);
      if (/\bset[A-Z]\w*\s*\(/.test(stripped)) {
        return [this.toViolation(filePath, index + 1, line.trim())];
      }
      return [];
    });
  }

  private toViolation(file: string, line: number, snippet: string): Violation {
    return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
  }
}
