"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndentDepthRule = void 0;
const lineUtils_1 = require("./lineUtils");
const MAX_CONTROL_DEPTH = 1;
const CONTROL_FLOW = /\b(if|for|while|do)\b/;
const CONTROL_FLOW_GLOBAL = /\b(if|for|while|do)\b/g;
const CLASS_DECL = /\b(class|interface|enum)\b/;
const METHOD_DECL = /^\s+(public|private|protected|static|\s)+[\w<>\[\]]+\s+\w+\s*\(/;
class IndentDepthRule {
    constructor() {
        this.ruleId = 'indent-depth';
        this.ruleName = `들여쓰기 depth ${MAX_CONTROL_DEPTH} 초과 금지`;
    }
    check(lines, filePath) {
        const violations = [];
        const blockStack = [];
        lines.forEach((line, index) => {
            const stripped = (0, lineUtils_1.stripCommentsAndStrings)(line);
            const opens = (stripped.match(/\{/g) ?? []).length;
            const closes = (stripped.match(/\}/g) ?? []).length;
            const controlFlowCount = (stripped.match(CONTROL_FLOW_GLOBAL) ?? []).length;
            const lineBaseType = classifyLineType(stripped);
            for (let i = 0; i < opens; i++) {
                const blockType = resolveBlockType(i, controlFlowCount, lineBaseType);
                blockStack.push(blockType);
            }
            const controlDepth = blockStack.filter(b => b === 'control').length;
            const insideMethod = blockStack.some(b => b === 'method');
            if (insideMethod && CONTROL_FLOW.test(stripped) && controlDepth > MAX_CONTROL_DEPTH) {
                violations.push(this.toViolation(filePath, index + 1, line.trim()));
            }
            for (let i = 0; i < closes; i++) {
                blockStack.pop();
            }
        });
        return violations;
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.IndentDepthRule = IndentDepthRule;
function resolveBlockType(braceIndex, controlFlowCount, lineType) {
    if (lineType === 'class') {
        return braceIndex === 0 ? 'class' : 'other';
    }
    if (lineType === 'method') {
        return braceIndex === 0 ? 'method' : 'other';
    }
    if (braceIndex < controlFlowCount) {
        return 'control';
    }
    return 'other';
}
function classifyLineType(line) {
    if (CLASS_DECL.test(line)) {
        return 'class';
    }
    if (METHOD_DECL.test(line)) {
        return 'method';
    }
    return 'other';
}
//# sourceMappingURL=IndentDepthRule.js.map