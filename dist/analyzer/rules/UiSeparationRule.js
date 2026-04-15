"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiSeparationRule = void 0;
const lineUtils_1 = require("./lineUtils");
const path = __importStar(require("path"));
const VIEW_CLASS_PATTERN = /(InputView|ResultView|OutputView|ConsoleView)/i;
class UiSeparationRule {
    constructor() {
        this.ruleId = 'ui-separation';
        this.ruleName = 'UI 로직은 View 클래스에만 허용';
    }
    check(lines, filePath) {
        if (VIEW_CLASS_PATTERN.test(path.basename(filePath))) {
            return [];
        }
        return lines.flatMap((line, index) => {
            const stripped = (0, lineUtils_1.stripCommentsAndStrings)(line);
            if (/System\.(out|in|err)/.test(stripped)) {
                return [this.toViolation(filePath, index + 1, line.trim())];
            }
            return [];
        });
    }
    toViolation(file, line, snippet) {
        return { ruleId: this.ruleId, ruleName: this.ruleName, file, line, snippet };
    }
}
exports.UiSeparationRule = UiSeparationRule;
//# sourceMappingURL=UiSeparationRule.js.map