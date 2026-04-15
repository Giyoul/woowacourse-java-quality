import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class InstanceVariablesRule implements Rule {
    readonly ruleId = "instance-variables";
    readonly ruleName = "\uC778\uC2A4\uD134\uC2A4 \uBCC0\uC218 2\uAC1C \uCD08\uACFC \uAE08\uC9C0";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=InstanceVariablesRule.d.ts.map