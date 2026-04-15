import { generateMarkdownReport } from '../../src/analyzer/ReportGenerator';
import { AnalysisReport } from '../../src/types';

function makeReport(overrides: Partial<AnalysisReport> = {}): AnalysisReport {
  return {
    analyzedAt: '2026-04-15T00:00:00.000Z',
    targetPath: '/src/main',
    totalFiles: 1,
    totalViolations: 0,
    results: [],
    ...overrides,
  };
}

describe('ReportGenerator', () => {
  it('헤더에 분석 경로와 일시가 포함된다', () => {
    const report = makeReport({ targetPath: '/project/src' });
    const markdown = generateMarkdownReport(report);
    expect(markdown).toContain('# Woowacourse Java Quality Report');
    expect(markdown).toContain('/project/src');
  });

  it('요약에 파일 수와 위반 수가 표시된다', () => {
    const report = makeReport({ totalFiles: 5, totalViolations: 3 });
    const markdown = generateMarkdownReport(report);
    expect(markdown).toContain('5개');
    expect(markdown).toContain('3개');
  });

  it('위반 없으면 "위반 없음" 메시지 표시', () => {
    const report = makeReport({ results: [{ filePath: 'Foo.java', violations: [] }] });
    const markdown = generateMarkdownReport(report);
    expect(markdown).toContain('위반 없음');
  });

  it('위반 있으면 파일명, 줄 번호, 규칙명, 스니펫 포함', () => {
    const report = makeReport({
      totalViolations: 1,
      results: [{
        filePath: 'src/Game.java',
        violations: [{
          ruleId: 'else-keyword',
          ruleName: 'else 예약어 사용 금지',
          file: 'src/Game.java',
          line: 42,
          snippet: '} else {',
        }],
      }],
    });
    const markdown = generateMarkdownReport(report);
    expect(markdown).toContain('src/Game.java');
    expect(markdown).toContain('42');
    expect(markdown).toContain('else 예약어 사용 금지');
    expect(markdown).toContain('} else {');
  });

  it('수동 확인 필요 섹션이 항상 포함된다', () => {
    const report = makeReport();
    const markdown = generateMarkdownReport(report);
    expect(markdown).toContain('## 수동 확인 필요');
    expect(markdown).toContain('일급 컬렉션');
    expect(markdown).toContain('축약 금지');
  });

  it('대안 코드가 포함되지 않는다', () => {
    const report = makeReport({
      totalViolations: 1,
      results: [{
        filePath: 'Bad.java',
        violations: [{
          ruleId: 'else-keyword',
          ruleName: 'else 예약어 사용 금지',
          file: 'Bad.java',
          line: 5,
          snippet: '} else {',
        }],
      }],
    });
    const markdown = generateMarkdownReport(report);
    expect(markdown).not.toMatch(/수정.*예시|alternative|refactored/i);
  });
});
