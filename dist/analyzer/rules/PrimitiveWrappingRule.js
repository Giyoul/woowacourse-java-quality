"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimitiveWrappingRule = void 0;
const PRIMITIVE_TYPES = ['int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short', 'String'];
const INSTANCE_FIELD_PATTERN = new RegExp(`^[ \\t]+(private|protected|public)\\s+(?!static)(?:final\\s+)?(${PRIMITIVE_TYPES.join('|')})\\s+\\w+\\s*;`);
class PrimitiveWrappingRule {
    constructor() {
        this.ruleId = 'primitive-wrapping';
        this.ruleName = '원시값/문자열 포장 필요';
    }
    check(lines, filePath) {
        return lines.flatMap((line, index) => {
            if (INSTANCE_FIELD_PATTERN.test(line) && !line.includes('static')) {
                return [this.toViolation(filePath, index + 1, line.trim())];
            }
            return [];
        });
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.PrimitiveWrappingRule = PrimitiveWrappingRule;
//# sourceMappingURL=PrimitiveWrappingRule.js.map