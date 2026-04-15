"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockCommentTracker = void 0;
exports.stripCommentsAndStrings = stripCommentsAndStrings;
/**
 * 문자열 리터럴과 줄 주석을 제거한 코드만 반환한다.
 * 블록 주석은 JavaFileAnalyzer에서 처리 후 전달되므로 여기선 줄 주석과 문자열만 처리.
 */
function stripCommentsAndStrings(line) {
    return removeLineComment(removeInlineBlockComments(removeStringLiterals(line)));
}
function removeLineComment(line) {
    const commentIndex = line.indexOf('//');
    if (commentIndex === -1) {
        return line;
    }
    return line.substring(0, commentIndex);
}
function removeInlineBlockComments(line) {
    return line.replace(/\/\*.*?\*\//g, '');
}
function removeStringLiterals(line) {
    return line.replace(/"(?:[^"\\]|\\.)*"/g, '""');
}
/**
 * 줄이 블록 주석 내부인지 여부를 추적하는 상태 머신
 */
class BlockCommentTracker {
    constructor() {
        this.insideBlockComment = false;
    }
    isComment(line) {
        const trimmed = line.trim();
        if (this.insideBlockComment) {
            if (trimmed.includes('*/')) {
                this.insideBlockComment = false;
            }
            return true;
        }
        if (trimmed.startsWith('/*')) {
            if (!trimmed.includes('*/')) {
                this.insideBlockComment = true;
            }
            return true;
        }
        return false;
    }
}
exports.BlockCommentTracker = BlockCommentTracker;
//# sourceMappingURL=lineUtils.js.map