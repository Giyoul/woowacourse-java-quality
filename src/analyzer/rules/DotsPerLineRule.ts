import { Rule } from './Rule';
import { Violation } from '../../types';
import { stripCommentsAndStrings } from './lineUtils';

export class DotsPerLineRule implements Rule {
  readonly ruleId = 'dots-per-line';
  readonly ruleName = '한 줄에 점(.) 하나만 허용';

  check(lines: string[], filePath: string): Violation[] {
    return lines.flatMap((line, index) => {
      if (line.trimStart().startsWith('import')) {
        return [];
      }
      const stripped = stripCommentsAndStrings(line);
      const dotCount = countMethodChainDots(stripped);
      if (dotCount > 1) {
        return [this.toViolation(filePath, index + 1, line.trim())];
      }
      return [];
    });
  }

  private toViolation(file: string, line: number, snippet: string): Violation {
    return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
  }
}

function countMethodChainDots(code: string): number {
  const withoutDecimalPoints = code.replace(/\d+\.\d+/g, '0');
  const dots = withoutDecimalPoints.match(/[a-zA-Z_\)]\.[a-zA-Z_\(]/g) ?? [];
  return dots.length;
}
