import { Rule } from './Rule';
import { Violation } from '../../types';
import { stripCommentsAndStrings } from './lineUtils';
import * as path from 'path';

const VIEW_CLASS_PATTERN = /(InputView|ResultView|OutputView|ConsoleView)/i;

export class UiSeparationRule implements Rule {
  readonly ruleId = 'ui-separation';
  readonly ruleName = 'UI 로직은 View 클래스에만 허용';

  check(lines: string[], filePath: string): Violation[] {
    if (VIEW_CLASS_PATTERN.test(path.basename(filePath))) {
      return [];
    }
    return lines.flatMap((line, index) => {
      const stripped = stripCommentsAndStrings(line);
      if (/System\.(out|in|err)/.test(stripped)) {
        return [this.toViolation(filePath, index + 1, line.trim())];
      }
      return [];
    });
  }

  private toViolation(file: string, line: number, snippet: string): Violation {
    return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
  }
}
