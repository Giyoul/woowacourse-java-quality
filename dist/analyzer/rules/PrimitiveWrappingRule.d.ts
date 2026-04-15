import { Rule } from './Rule';
import { Violation } from '../../types';
export declare class PrimitiveWrappingRule implements Rule {
    readonly ruleId = "primitive-wrapping";
    readonly ruleName = "\uC6D0\uC2DC\uAC12/\uBB38\uC790\uC5F4 \uD3EC\uC7A5 \uD544\uC694";
    check(lines: string[], filePath: string): Violation[];
    private toViolation;
}
//# sourceMappingURL=PrimitiveWrappingRule.d.ts.map