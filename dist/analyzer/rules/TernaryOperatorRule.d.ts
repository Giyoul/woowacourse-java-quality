import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class TernaryOperatorRule implements Rule {
    readonly ruleId = "ternary-operator";
    readonly ruleName = "3\uD56D \uC5F0\uC0B0\uC790 \uC0AC\uC6A9 \uAE08\uC9C0";
    check(lines: string[], filePath: string): Violation[];
    private hasTernaryOperator;
    private toViolation;
}
//# sourceMappingURL=TernaryOperatorRule.d.ts.map