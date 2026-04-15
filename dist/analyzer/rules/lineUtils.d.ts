/**
 * 문자열 리터럴과 줄 주석을 제거한 코드만 반환한다.
 * 블록 주석은 JavaFileAnalyzer에서 처리 후 전달되므로 여기선 줄 주석과 문자열만 처리.
 */
export declare function stripCommentsAndStrings(line: string): string;
/**
 * 줄이 블록 주석 내부인지 여부를 추적하는 상태 머신
 */
export declare class BlockCommentTracker {
    private insideBlockComment;
    isComment(line: string): boolean;
}
//# sourceMappingURL=lineUtils.d.ts.map