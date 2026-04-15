import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class MethodLengthRule implements Rule {
    readonly ruleId = "method-length";
    readonly ruleName = "\uBA54\uC11C\uB4DC \uAE38\uC774 10\uC904 \uCD08\uACFC \uAE08\uC9C0";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=MethodLengthRule.d.ts.map