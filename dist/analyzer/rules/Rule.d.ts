import { Violation } from '../../types';
export interface Rule {
    readonly ruleId: string;
    readonly ruleName: string;
    check(lines: string[], filePath: string): Violation[];
}
//# sourceMappingURL=Rule.d.ts.map