import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class ArrayUsageRule implements Rule {
    readonly ruleId = "array-usage";
    readonly ruleName = "\uBC30\uC5F4 \uC0AC\uC6A9 \uAE08\uC9C0 (\uCEEC\uB809\uC158 \uC0AC\uC6A9)";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=ArrayUsageRule.d.ts.map