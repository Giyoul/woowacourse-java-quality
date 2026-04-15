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
exports.analyzeFile = analyzeFile;
const fs = __importStar(require("fs"));
const lineUtils_1 = require("./rules/lineUtils");
const ElseKeywordRule_1 = require("./rules/ElseKeywordRule");
const TernaryOperatorRule_1 = require("./rules/TernaryOperatorRule");
const SwitchCaseRule_1 = require("./rules/SwitchCaseRule");
const MethodLengthRule_1 = require("./rules/MethodLengthRule");
const IndentDepthRule_1 = require("./rules/IndentDepthRule");
const ArrayUsageRule_1 = require("./rules/ArrayUsageRule");
const GetterSetterRule_1 = require("./rules/GetterSetterRule");
const InstanceVariablesRule_1 = require("./rules/InstanceVariablesRule");
const UiSeparationRule_1 = require("./rules/UiSeparationRule");
const PrimitiveWrappingRule_1 = require("./rules/PrimitiveWrappingRule");
const ALL_RULES = [
    new ElseKeywordRule_1.ElseKeywordRule(),
    new TernaryOperatorRule_1.TernaryOperatorRule(),
    new SwitchCaseRule_1.SwitchCaseRule(),
    new MethodLengthRule_1.MethodLengthRule(),
    new IndentDepthRule_1.IndentDepthRule(),
    new ArrayUsageRule_1.ArrayUsageRule(),
    new GetterSetterRule_1.GetterSetterRule(),
    new InstanceVariablesRule_1.InstanceVariablesRule(),
    new UiSeparationRule_1.UiSeparationRule(),
    new PrimitiveWrappingRule_1.PrimitiveWrappingRule(),
];
function analyzeFile(filePath) {
    const rawLines = fs.readFileSync(filePath, 'utf-8').split('\n');
    const lines = filterBlockComments(rawLines);
    const violations = ALL_RULES.flatMap(rule => rule.check(lines, filePath));
    return { filePath, violations };
}
function filterBlockComments(lines) {
    const tracker = new lineUtils_1.BlockCommentTracker();
    return lines.map(line => {
        if (tracker.isComment(line)) {
            return '';
        }
        return line;
    });
}
//# sourceMappingURL=JavaFileAnalyzer.js.map