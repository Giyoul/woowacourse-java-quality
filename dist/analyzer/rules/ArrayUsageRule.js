"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayUsageRule = void 0;
const lineUtils_1 = require("./lineUtils");
class ArrayUsageRule {
    constructor() {
        this.ruleId = 'array-usage';
        this.ruleName = '배열 사용 금지 (컬렉션 사용)';
    }
    check(lines, filePath) {
        return lines.flatMap((line, index) => {
            const stripped = (0, lineUtils_1.stripCommentsAndStrings)(line);
            if (/\w+\s*\[\s*\]/.test(stripped) && !isMainMethodSignature(stripped)) {
                return [this.toViolation(filePath, index + 1, line.trim())];
            }
            return [];
        });
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.ArrayUsageRule = ArrayUsageRule;
function isMainMethodSignature(code) {
    return /\bpublic\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]/.test(code);
}
//# sourceMappingURL=ArrayUsageRule.js.map