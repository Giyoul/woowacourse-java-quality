import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class ElseKeywordRule implements Rule {
    readonly ruleId = "else-keyword";
    readonly ruleName = "else \uC608\uC57D\uC5B4 \uC0AC\uC6A9 \uAE08\uC9C0";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=ElseKeywordRule.d.ts.map