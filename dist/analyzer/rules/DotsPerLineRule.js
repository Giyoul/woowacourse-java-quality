"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotsPerLineRule = void 0;
const lineUtils_1 = require("./lineUtils");
class DotsPerLineRule {
    constructor() {
        this.ruleId = 'dots-per-line';
        this.ruleName = '한 줄에 점(.) 하나만 허용';
    }
    check(lines, filePath) {
        return lines.flatMap((line, index) => {
            if (line.trimStart().startsWith('import')) {
                return [];
            }
            const stripped = (0, lineUtils_1.stripCommentsAndStrings)(line);
            const dotCount = countMethodChainDots(stripped);
            if (dotCount > 1) {
                return [this.toViolation(filePath, index + 1, line.trim())];
            }
            return [];
        });
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.DotsPerLineRule = DotsPerLineRule;
function countMethodChainDots(code) {
    const withoutDecimalPoints = code.replace(/\d+\.\d+/g, '0');
    const dots = withoutDecimalPoints.match(/[a-zA-Z_\)]\.[a-zA-Z_\(]/g) ?? [];
    return dots.length;
}
//# sourceMappingURL=DotsPerLineRule.js.map