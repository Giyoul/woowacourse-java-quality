import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class IndentDepthRule implements Rule {
    readonly ruleId = "indent-depth";
    readonly ruleName = "\uB4E4\uC5EC\uC4F0\uAE30 depth 1 \uCD08\uACFC \uAE08\uC9C0";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=IndentDepthRule.d.ts.map