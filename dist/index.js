#!/usr/bin/env node
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
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const FileWalker_1 = require("./analyzer/FileWalker");
const JavaFileAnalyzer_1 = require("./analyzer/JavaFileAnalyzer");
const ReportGenerator_1 = require("./analyzer/ReportGenerator");
const DEFAULT_REPORT_PATH = './quality-report.md';
const server = new index_js_1.Server({ name: 'woowacourse-quality-checker', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
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
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    if (request.params.name === 'analyze_java_quality') {
        return handleAnalyze(request.params.arguments);
    }
    if (request.params.name === 'get_report') {
        return handleGetReport(request.params.arguments);
    }
    throw new Error(`알 수 없는 도구: ${request.params.name}`);
});
function handleAnalyze(args) {
    const targetPath = args['targetPath'];
    const reportPath = args['reportPath'] ?? DEFAULT_REPORT_PATH;
    if (!fs.existsSync(targetPath)) {
        return { content: [{ type: 'text', text: `오류: 경로를 찾을 수 없습니다 — ${targetPath}` }], isError: true };
    }
    const javaFiles = (0, FileWalker_1.collectJavaFiles)(targetPath);
    if (javaFiles.length === 0) {
        return { content: [{ type: 'text', text: `Java 파일을 찾을 수 없습니다: ${targetPath}` }] };
    }
    const results = javaFiles.map(JavaFileAnalyzer_1.analyzeFile);
    const report = {
        analyzedAt: new Date().toISOString(),
        targetPath,
        totalFiles: javaFiles.length,
        totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
        results,
    };
    const markdown = (0, ReportGenerator_1.generateMarkdownReport)(report);
    fs.writeFileSync(reportPath, markdown, 'utf-8');
    const summary = `분석 완료: ${report.totalFiles}개 파일, ${report.totalViolations}개 위반 항목 발견.\n리포트: ${path.resolve(reportPath)}`;
    return { content: [{ type: 'text', text: summary }] };
}
function handleGetReport(args) {
    const reportPath = args['reportPath'] ?? DEFAULT_REPORT_PATH;
    if (!fs.existsSync(reportPath)) {
        return { content: [{ type: 'text', text: `리포트 파일이 없습니다. 먼저 analyze_java_quality를 실행하세요.` }], isError: true };
    }
    const content = fs.readFileSync(reportPath, 'utf-8');
    return { content: [{ type: 'text', text: content }] };
}
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
//# sourceMappingURL=index.js.map