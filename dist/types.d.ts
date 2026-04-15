export interface Violation {
    ruleId: string;
    ruleName: string;
    file: string;
    line: number;
    snippet: string;
}
export interface FileAnalysisResult {
    filePath: string;
    violations: Violation[];
}
export interface AnalysisReport {
    analyzedAt: string;
    targetPath: string;
    totalFiles: number;
    totalViolations: number;
    results: FileAnalysisResult[];
}
//# sourceMappingURL=types.d.ts.map