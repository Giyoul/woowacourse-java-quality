#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { collectJavaFiles } from './analyzer/FileWalker';
import { analyzeFile } from './analyzer/JavaFileAnalyzer';
import { generateMarkdownReport } from './analyzer/ReportGenerator';
import { AnalysisReport } from './types';

const DEFAULT_REPORT_PATH = './quality-report.md';

const server = new Server(
  { name: 'woowacourse-quality-checker', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'analyze_java_quality',
      description: '우아한테크코스 Java 코딩 규칙 위반 사항을 분석하고 Markdown 리포트를 생성합니다.',
      inputSchema: {
        type: 'object',
        properties: {
          targetPath: {
            type: 'string',
            description: '분석할 Java 소스 파일 또는 디렉토리 경로',
          },
          reportPath: {
            type: 'string',
            description: `리포트 저장 경로 (기본값: ${DEFAULT_REPORT_PATH})`,
          },
        },
        required: ['targetPath'],
      },
    },
    {
      name: 'get_report',
      description: '가장 최근 생성된 quality-report.md 내용을 반환합니다.',
      inputSchema: {
        type: 'object',
        properties: {
          reportPath: {
            type: 'string',
            description: `리포트 경로 (기본값: ${DEFAULT_REPORT_PATH})`,
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'analyze_java_quality') {
    return handleAnalyze(request.params.arguments as Record<string, string>);
  }
  if (request.params.name === 'get_report') {
    return handleGetReport(request.params.arguments as Record<string, string>);
  }
  throw new Error(`알 수 없는 도구: ${request.params.name}`);
});

function handleAnalyze(args: Record<string, string>) {
  const targetPath = args['targetPath'];
  const reportPath = args['reportPath'] ?? DEFAULT_REPORT_PATH;

  if (!fs.existsSync(targetPath)) {
    return { content: [{ type: 'text', text: `오류: 경로를 찾을 수 없습니다 — ${targetPath}` }], isError: true };
  }

  const javaFiles = collectJavaFiles(targetPath);
  if (javaFiles.length === 0) {
    return { content: [{ type: 'text', text: `Java 파일을 찾을 수 없습니다: ${targetPath}` }] };
  }

  const results = javaFiles.map(analyzeFile);
  const report: AnalysisReport = {
    analyzedAt: new Date().toISOString(),
    targetPath,
    totalFiles: javaFiles.length,
    totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
    results,
  };

  const markdown = generateMarkdownReport(report);
  fs.writeFileSync(reportPath, markdown, 'utf-8');

  const summary = `분석 완료: ${report.totalFiles}개 파일, ${report.totalViolations}개 위반 항목 발견.\n리포트: ${path.resolve(reportPath)}`;
  return { content: [{ type: 'text', text: summary }] };
}

function handleGetReport(args: Record<string, string>) {
  const reportPath = args['reportPath'] ?? DEFAULT_REPORT_PATH;
  if (!fs.existsSync(reportPath)) {
    return { content: [{ type: 'text', text: `리포트 파일이 없습니다. 먼저 analyze_java_quality를 실행하세요.` }], isError: true };
  }
  const content = fs.readFileSync(reportPath, 'utf-8');
  return { content: [{ type: 'text', text: content }] };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
