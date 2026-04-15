import { Rule } from './Rule';
import { Violation } from '../../types';

const PRIMITIVE_TYPES = ['int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short', 'String'];
const INSTANCE_FIELD_PATTERN = new RegExp(
  `^[ \\t]+(private|protected|public)\\s+(?!static)(?:final\\s+)?(${PRIMITIVE_TYPES.join('|')})\\s+\\w+\\s*;`
);

export class PrimitiveWrappingRule implements Rule {
  readonly ruleId = 'primitive-wrapping';
  readonly ruleName = '원시값/문자열 포장 필요';

  check(lines: string[], filePath: string): Violation[] {
    return lines.flatMap((line, index) => {
      if (INSTANCE_FIELD_PATTERN.test(line) && !line.includes('static')) {
        return [this.toViolation(filePath, index + 1, line.trim())];
      }
      return [];
    });
  }

  private toViolation(file: string, line: number, snippet: string): Violation {
    return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
  }
}
