"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElseKeywordRule = void 0;
const lineUtils_1 = require("./lineUtils");
class ElseKeywordRule {
    constructor() {
        this.ruleId = 'else-keyword';
        this.ruleName = 'else 예약어 사용 금지';
    }
    check(lines, filePath) {
        return lines.flatMap((line, index) => {
            const stripped = (0, lineUtils_1.stripCommentsAndStrings)(line);
            if (/\belse\b/.test(stripped)) {
                return [this.toViolation(filePath, index + 1, line.trim())];
            }
            return [];
        });
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.ElseKeywordRule = ElseKeywordRule;
//# sourceMappingURL=ElseKeywordRule.js.map