import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class DotsPerLineRule implements Rule {
    readonly ruleId = "dots-per-line";
    readonly ruleName = "\uD55C \uC904\uC5D0 \uC810(.) \uD558\uB098\uB9CC \uD5C8\uC6A9";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=DotsPerLineRule.d.ts.map