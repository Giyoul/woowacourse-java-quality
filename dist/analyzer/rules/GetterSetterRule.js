"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetterSetterRule = void 0;
const lineUtils_1 = require("./lineUtils");
class GetterSetterRule {
    constructor() {
        this.ruleId = 'setter';
        this.ruleName = 'setter 사용 금지';
    }
    check(lines, filePath) {
        return lines.flatMap((line, index) => {
            const stripped = (0, lineUtils_1.stripCommentsAndStrings)(line);
            if (/\bset[A-Z]\w*\s*\(/.test(stripped)) {
                return [this.toViolation(filePath, index + 1, line.trim())];
            }
            return [];
        });
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.GetterSetterRule = GetterSetterRule;
//# sourceMappingURL=GetterSetterRule.js.map