"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCaseRule = void 0;
const lineUtils_1 = require("./lineUtils");
class SwitchCaseRule {
    constructor() {
        this.ruleId = 'switch-case';
        this.ruleName = 'switch/case 사용 금지';
    }
    check(lines, filePath) {
        return lines.flatMap((line, index) => {
            const stripped = (0, lineUtils_1.stripCommentsAndStrings)(line);
            if (/\bswitch\b/.test(stripped) || /\bcase\b/.test(stripped)) {
                return [this.toViolation(filePath, index + 1, line.trim())];
            }
            return [];
        });
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.SwitchCaseRule = SwitchCaseRule;
//# sourceMappingURL=SwitchCaseRule.js.map