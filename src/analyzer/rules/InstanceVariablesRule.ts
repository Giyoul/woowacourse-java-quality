import { Rule } from './Rule';
import { Violation } from '../../types';

const MAX_INSTANCE_VARS = 2;
const CLASS_DECL = /^\s*(public|private|protected)?\s*(abstract|final)?\s*class\s+(\w+)/;
const INSTANCE_FIELD = /^\s+(private|protected|public)\s+(?!static)[\w<>\[\],\s]+\s+\w+\s*;/;
const STATIC_FIELD = /^\s+(private|protected|public)\s+static\s+/;

interface ClassFrame {
  startLine: number;
  snippet: string;
  instanceVarCount: number;
  braceDepth: number;
}

export class InstanceVariablesRule implements Rule {
  readonly ruleId = 'instance-variables';
  readonly ruleName = `인스턴스 변수 ${MAX_INSTANCE_VARS}개 초과 금지`;

  check(lines: string[], filePath: string): Violation[] {
    const violations: Violation[] = [];
    const classStack: ClassFrame[] = [];

    lines.forEach((line, index) => {
      const classMatch = CLASS_DECL.exec(line);
      if (classMatch) {
        classStack.push({ startLine: index + 1, snippet: line.trim(), instanceVarCount: 0, braceDepth: 0 });
      }

      if (classStack.length === 0) {
        return;
      }

      const frame = classStack[classStack.length - 1];
      frame.braceDepth += (line.match(/\{/g) ?? []).length;
      frame.braceDepth -= (line.match(/\}/g) ?? []).length;

      const isClassBodyField = frame.braceDepth === 1 && INSTANCE_FIELD.test(line) && !STATIC_FIELD.test(line);
      if (isClassBodyField) {
        frame.instanceVarCount++;
      }

      if (frame.braceDepth <= 0) {
        if (frame.instanceVarCount > MAX_INSTANCE_VARS) {
          violations.push(this.toViolation(filePath, frame.startLine, frame.snippet));
        }
        classStack.pop();
      }
    });

    return violations;
  }

  private toViolation(file: string, line: number, snippet: string): Violation {
    return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
  }
}
