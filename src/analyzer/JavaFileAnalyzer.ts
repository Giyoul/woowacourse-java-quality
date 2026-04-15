import * as fs from 'fs';
import { Rule } from './rules/Rule';
import { FileAnalysisResult, Violation } from '../types';
import { BlockCommentTracker } from './rules/lineUtils';
import { ElseKeywordRule } from './rules/ElseKeywordRule';
import { TernaryOperatorRule } from './rules/TernaryOperatorRule';
import { SwitchCaseRule } from './rules/SwitchCaseRule';
import { MethodLengthRule } from './rules/MethodLengthRule';
import { IndentDepthRule } from './rules/IndentDepthRule';
import { ArrayUsageRule } from './rules/ArrayUsageRule';
import { GetterSetterRule } from './rules/GetterSetterRule';
import { InstanceVariablesRule } from './rules/InstanceVariablesRule';
import { UiSeparationRule } from './rules/UiSeparationRule';
import { PrimitiveWrappingRule } from './rules/PrimitiveWrappingRule';

const ALL_RULES: Rule[] = [
  new ElseKeywordRule(),
  new TernaryOperatorRule(),
  new SwitchCaseRule(),
  new MethodLengthRule(),
  new IndentDepthRule(),
  new ArrayUsageRule(),
  new GetterSetterRule(),
  new InstanceVariablesRule(),
  new UiSeparationRule(),
  new PrimitiveWrappingRule(),
];

export function analyzeFile(filePath: string): FileAnalysisResult {
  const rawLines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const lines = filterBlockComments(rawLines);
  const violations = ALL_RULES.flatMap(rule => rule.check(lines, filePath));
  return { filePath, violations };
}

function filterBlockComments(lines: string[]): string[] {
  const tracker = new BlockCommentTracker();
  return lines.map(line => {
    if (tracker.isComment(line)) {
      return '';
    }
    return line;
  });
}
