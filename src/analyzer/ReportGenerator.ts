import { AnalysisReport, FileAnalysisResult } from '../types';

const MANUAL_CHECK_RULES = [
  '축약 금지 (줄여 쓰지 않기) — 의미 기반 판단 필요',
  '일급 컬렉션 사용 여부 — 구조적 의미 판단 필요',
  '함수가 한 가지 일만 하는지 (단일 책임) — 의미 기반 판단 필요',
  '단위 테스트 존재 여부 — 비즈니스 클래스와 테스트 클래스 매핑 필요',
];

export function generateMarkdownReport(report: AnalysisReport): string {
  const sections: string[] = [];
  sections.push(buildHeader(report));
  sections.push(buildSummary(report));
  sections.push(buildViolationList(report.results));
  sections.push(buildManualCheckSection());
  return sections.join('\n\n');
}

function buildHeader(report: AnalysisReport): string {
  return [
    '# Woowacourse Java Quality Report',
    '',
    `- **분석 일시**: ${report.analyzedAt}`,
    `- **분석 경로**: \`${report.targetPath}\``,
  ].join('\n');
}

function buildSummary(report: AnalysisReport): string {
  return [
    '## 요약',
    '',
    `| 항목 | 수치 |`,
    `|------|------|`,
    `| 분석 파일 수 | ${report.totalFiles}개 |`,
    `| 총 위반 항목 수 | ${report.totalViolations}개 |`,
    `| 위반 파일 수 | ${countViolatedFiles(report.results)}개 |`,
  ].join('\n');
}

function countViolatedFiles(results: FileAnalysisResult[]): number {
  return results.filter(r => r.violations.length > 0).length;
}

function buildViolationList(results: FileAnalysisResult[]): string {
  const violated = results.filter(r => r.violations.length > 0);
  if (violated.length === 0) {
    return '## 위반 목록\n\n> 위반 없음 — 모든 규칙을 준수하고 있습니다.';
  }
  const fileBlocks = violated.map(buildFileBlock).join('\n\n');
  return `## 위반 목록\n\n${fileBlocks}`;
}

function buildFileBlock(result: FileAnalysisResult): string {
  const rows = result.violations
    .map(v => `| ${v.line} | ${v.ruleName} | \`${escapeMarkdown(v.snippet)}\` |`)
    .join('\n');
  return [
    `### \`${result.filePath}\``,
    '',
    '| 줄 | 규칙 | 코드 |',
    '|----|------|------|',
    rows,
  ].join('\n');
}

function buildManualCheckSection(): string {
  const items = MANUAL_CHECK_RULES.map(r => `- ${r}`).join('\n');
  return ['## 수동 확인 필요', '', items].join('\n');
}

function escapeMarkdown(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/`/g, "'");
}
