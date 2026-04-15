"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodLengthRule = void 0;
const lineUtils_1 = require("./lineUtils");
const MAX_METHOD_LINES = 10;
const METHOD_SIGNATURE_START = /^\s+(public|private|protected|static|\s)+[\w<>\[\]]+\s+\w+\s*\(/;
const METHOD_SIGNATURE_END = /\)\s*(throws\s+[\w,\s]+)?\s*\{/;
class MethodLengthRule {
    constructor() {
        this.ruleId = 'method-length';
        this.ruleName = `메서드 길이 ${MAX_METHOD_LINES}줄 초과 금지`;
    }
    check(lines, filePath) {
        const violations = [];
        let methodStartLine = -1;
        let braceDepth = 0;
        let methodBodyLines = 0;
        let insideMethod = false;
        let pendingMethodStart = false;
        lines.forEach((line, index) => {
            const stripped = (0, lineUtils_1.stripCommentsAndStrings)(line);
            if (!insideMethod && !pendingMethodStart && METHOD_SIGNATURE_START.test(line)) {
                pendingMethodStart = true;
                methodStartLine = index + 1;
                methodBodyLines = 0;
            }
            if (pendingMethodStart && METHOD_SIGNATURE_END.test(stripped)) {
                pendingMethodStart = false;
                insideMethod = true;
                braceDepth = 1;
                return;
            }
            if (!insideMethod) {
                return;
            }
            braceDepth += countBraces(stripped, '{') - countBraces(stripped, '}');
            if (braceDepth > 0) {
                methodBodyLines++;
            }
            if (braceDepth <= 0) {
                if (methodBodyLines > MAX_METHOD_LINES) {
                    violations.push(this.toViolation(filePath, methodStartLine, lines[methodStartLine - 1].trim()));
                }
                insideMethod = false;
            }
        });
        return violations;
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.MethodLengthRule = MethodLengthRule;
function countBraces(line, brace) {
    const pattern = brace === '{' ? /\{/g : /\}/g;
    return (line.match(pattern) ?? []).length;
}
//# sourceMappingURL=MethodLengthRule.js.map