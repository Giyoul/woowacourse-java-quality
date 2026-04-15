import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class SwitchCaseRule implements Rule {
    readonly ruleId = "switch-case";
    readonly ruleName = "switch/case \uC0AC\uC6A9 \uAE08\uC9C0";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=SwitchCaseRule.d.ts.map