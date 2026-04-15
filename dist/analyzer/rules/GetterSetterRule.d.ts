import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class GetterSetterRule implements Rule {
    readonly ruleId = "setter";
    readonly ruleName = "setter \uC0AC\uC6A9 \uAE08\uC9C0";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=GetterSetterRule.d.ts.map