import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class UiSeparationRule implements Rule {
    readonly ruleId = "ui-separation";
    readonly ruleName = "UI \uB85C\uC9C1\uC740 View \uD074\uB798\uC2A4\uC5D0\uB9CC \uD5C8\uC6A9";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=UiSeparationRule.d.ts.map