"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TernaryOperatorRule = void 0;
const lineUtils_1 = require("./lineUtils");
class TernaryOperatorRule {
    constructor() {
        this.ruleId = 'ternary-operator';
        this.ruleName = '3항 연산자 사용 금지';
    }
    check(lines, filePath) {
        return lines.flatMap((line, index) => {
            const stripped = (0, lineUtils_1.stripCommentsAndStrings)(line);
            if (this.hasTernaryOperator(stripped)) {
                return [this.toViolation(filePath, index + 1, line.trim())];
            }
            return [];
        });
    }
    hasTernaryOperator(code) {
        return /\S\s*\?\s*\S.*:\s*\S/.test(code) && !/\?\s*(>|extends\b|super\b)/.test(code);
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.TernaryOperatorRule = TernaryOperatorRule;
//# sourceMappingURL=TernaryOperatorRule.js.map