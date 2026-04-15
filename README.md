# woowacourse-quality-checker

우아한테크코스 Java 과제의 코딩 규칙 위반 사항을 자동으로 감지하고 Markdown 리포트를 생성하는 **MCP 플러그인**입니다.

MCP(Model Context Protocol)를 지원하는 모든 AI 도구(Claude Code, Codex CLI, Cursor, Windsurf 등)에서 설치해 사용할 수 있습니다.

---

## 목차

- [마켓 등록 방법](#마켓-등록-방법)
- [설치 방법](#설치-방법)
- [사용 방법](#사용-방법)
- [검증 항목](#검증-항목)
- [검증 플로우](#검증-플로우)
- [리포트 형식](#리포트-형식)
- [개발자 가이드](#개발자-가이드)

---

## 마켓 등록 방법

MCP 서버는 **npm 패키지**로 배포합니다. npm에 배포하면 누구나 `npx`로 바로 실행할 수 있습니다.

### 1단계: npm 계정 준비

```bash
# npm 계정이 없으면 생성
npm adduser

# 이미 있으면 로그인
npm login
```

### 2단계: 빌드 및 배포

```bash
# TypeScript 컴파일
npm run build

# npm에 배포
npm publish

# 또는 scoped 패키지로 배포 (패키지명 충돌 방지)
# package.json의 name을 "@your-id/woowacourse-quality-checker"로 변경 후
npm publish --access public
```

### 3단계: MCP 레지스트리 등록 (선택)

공식 MCP 레지스트리에 등록하면 각 AI 도구의 마켓플레이스에서 검색됩니다.

- **레지스트리**: [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- Pull Request로 `README.md` 목록에 추가 요청

---

## 설치 방법

### Claude Code

```bash
# 설치
claude mcp add woowacourse-quality-checker npx woowacourse-quality-checker

# 설치 확인
claude mcp list
```

업데이트:

```bash
claude mcp remove woowacourse-quality-checker
claude mcp add woowacourse-quality-checker npx woowacourse-quality-checker
```

### Codex CLI

```bash
# 설치
codex mcp add woowacourse-quality-checker npx woowacourse-quality-checker

# 설치 확인
codex mcp list
```

업데이트:

```bash
codex mcp remove woowacourse-quality-checker
codex mcp add woowacourse-quality-checker npx woowacourse-quality-checker
```

### Claude Desktop / Cursor / Windsurf

각 도구의 MCP 설정 파일에 아래 항목을 추가한 후 재시작합니다.

| 도구 | 설정 파일 경로 |
|------|--------------|
| Claude Desktop (macOS) | `~/.claude/claude_desktop_config.json` |
| Claude Desktop (Windows) | `%APPDATA%\Claude\claude_desktop_config.json` |
| Cursor | `.cursor/mcp.json` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |

```json
{
  "mcpServers": {
    "woowacourse-quality-checker": {
      "command": "npx",
      "args": ["woowacourse-quality-checker"]
    }
  }
}
```

---

## 사용 방법

설치 후 AI에게 자연어로 요청하거나 도구를 직접 호출합니다.

### 자연어 요청

```
"src/main/java 디렉토리의 Java 코드 품질을 검사해줘"
"현재 프로젝트 전체 코딩 규칙 위반 사항 리포트 만들어줘"
"방금 생성된 quality-report.md 내용 보여줘"
```

### 제공 도구

플러그인은 두 가지 MCP 도구를 제공합니다.

#### `analyze_java_quality`

Java 소스 파일 또는 디렉토리를 분석하고 `quality-report.md`를 생성합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `targetPath` | string | ✅ | 분석할 파일 또는 디렉토리 경로 |
| `reportPath` | string | ❌ | 리포트 저장 경로 (기본값: `./quality-report.md`) |

**응답 예시:**
```
분석 완료: 12개 파일, 7개 위반 항목 발견.
리포트: /Users/.../quality-report.md
```

#### `get_report`

가장 최근 생성된 리포트 내용을 반환합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `reportPath` | string | ❌ | 리포트 경로 (기본값: `./quality-report.md`) |

---

## 검증 항목

### 자동 검증 (10개 규칙)

| # | 규칙 | 설명 | 예시 위반 코드 |
|---|------|------|---------------|
| 1 | **else 예약어 금지** | `else`, `else if` 사용 감지 | `} else {` |
| 2 | **switch/case 금지** | `switch`, `case` 키워드 감지 | `switch (status) {` |
| 3 | **3항 연산자 금지** | `조건 ? A : B` 패턴 감지 | `int x = a > 0 ? a : 0;` |
| 4 | **메서드 길이 초과** | 메서드 바디 10줄 초과 감지 | 11줄 이상의 메서드 |
| 5 | **들여쓰기 depth 초과** | 제어구조 중첩 depth 2 이상 감지 | while 안의 if |
| 6 | **배열 사용 금지** | `int[]`, `String[]` 등 배열 선언 감지 | `private int[] numbers;` |
| 7 | **setter 금지** | `setXxx()` 패턴 감지 | `public void setName(String name)` |
| 8 | **인스턴스 변수 3개 초과** | 클래스당 인스턴스 변수 3개 이상 감지 | 필드 a, b, c 보유 클래스 |
| 9 | **UI 분리 위반** | 비View 클래스의 `System.out/in` 사용 감지 | `GameService`에서 `System.out.println` |
| 10 | **원시값 미포장** | 인스턴스 변수에 원시 타입 직접 사용 감지 | `private int score;` |

> **참고**: `InputView`, `ResultView`, `OutputView`, `ConsoleView` 계열 클래스에서의 `System.out/in` 사용은 위반으로 처리하지 않습니다.
>
> **참고**: `public static void main(String[] args)`의 `String[]`는 Java 언어 필수 구조이므로 위반으로 처리하지 않습니다.

### 수동 확인 필요 (자동화 불가)

리포트 하단의 **수동 확인 필요** 섹션에 항상 명시됩니다.

| 항목 | 이유 |
|------|------|
| 한 줄에 점 하나만 (TDA 원칙) | 메서드 체이닝의 의미적 판단 필요 |
| 줄여 쓰지 않기 (축약 금지) | 의미 기반 판단 필요 |
| 일급 컬렉션 사용 여부 | 컬렉션 래핑 구조의 의미적 판단 필요 |
| 함수 단일 책임 원칙 | 함수가 하는 일의 의미 기반 판단 필요 |
| 단위 테스트 존재 여부 | 비즈니스 클래스 ↔ 테스트 클래스 매핑 필요 |

---

## 검증 플로우

```
Java 소스 파일
      │
      ▼
┌─────────────────┐
│  FileWalker      │  .java 파일 재귀 탐색
└────────┬────────┘
         │ [파일 목록]
         ▼
┌─────────────────┐
│ JavaFileAnalyzer │  파일별 분석
│                  │
│  ① 블록 주석 제거  │  /* ... */ 내부 코드 무시
│  ② 10개 Rule 실행 │  각 Rule.check(lines, filePath)
│                  │
│  공통 전처리      │  줄마다 문자열 리터럴·주석 제거 → 오탐 방지
└────────┬────────┘
         │ [Violation[]]
         ▼
┌─────────────────┐
│ ReportGenerator  │  Markdown 리포트 생성
│                  │
│  • 요약 테이블    │
│  • 위반 목록     │  파일·줄번호·규칙·코드 스니펫
│  • 수동 확인 섹션 │
└────────┬────────┘
         │
         ▼
   quality-report.md
```

> **대안 코드 미제공 원칙**: 리포트는 위반 사실과 위치만 알립니다. 수정 방법은 제안하지 않습니다.

---

## 리포트 형식

`quality-report.md` 예시:

```markdown
# Woowacourse Java Quality Report

- **분석 일시**: 2026-04-15T10:00:00.000Z
- **분석 경로**: `/project/src/main/java`

## 요약

| 항목 | 수치 |
|------|------|
| 분석 파일 수 | 8개 |
| 총 위반 항목 수 | 5개 |
| 위반 파일 수 | 3개 |

## 위반 목록

### `src/main/java/baseball/GameController.java`

| 줄 | 규칙 | 코드 |
|----|------|------|
| 23 | else 예약어 사용 금지 | `} else {` |
| 41 | 메서드 길이 10줄 초과 금지 | `private void processInput() {` |

## 수동 확인 필요

- 한 줄에 점 하나만 (TDA 원칙) — 메서드 체이닝의 의미적 판단 필요
- 축약 금지 (줄여 쓰지 않기) — 의미 기반 판단 필요
- 일급 컬렉션 사용 여부 — 구조적 의미 판단 필요
- 함수가 한 가지 일만 하는지 (단일 책임) — 의미 기반 판단 필요
- 단위 테스트 존재 여부 — 비즈니스 클래스와 테스트 클래스 매핑 필요
```

---

## 개발자 가이드

### 환경 설정

```bash
npm install
npm test
npm run build
```

### 새 규칙 추가

1. `src/analyzer/rules/MyNewRule.ts` 생성:

```typescript
import { Rule } from './Rule';
import { Violation } from '../../types';
import { stripCommentsAndStrings } from './lineUtils';

export class MyNewRule implements Rule {
  readonly ruleId = 'my-new-rule';
  readonly ruleName = '새 규칙 설명';

  check(lines: string[], filePath: string): Violation[] {
    return lines.flatMap((line, index) => {
      const stripped = stripCommentsAndStrings(line);
      if (/* 위반 패턴 */) {
        return [{ ruleId: this.ruleId, ruleName: this.ruleName, file: filePath, line: index + 1, snippet: line.trim() }];
      }
      return [];
    });
  }
}
```

2. `test/rules/MyNewRule.test.ts`에 단위 테스트 작성 (TDD 필수)

3. `src/analyzer/JavaFileAnalyzer.ts`의 `ALL_RULES` 배열에 추가

### 알려진 한계

- **괄호 없는 제어구조**: `if (a) if (b) doIt();` 형태의 braceless 중첩은 들여쓰기 depth 규칙이 감지하지 못합니다.
- **TDA 원칙**: `a.getB().doC()` 같은 메서드 체이닝은 의미적 판단이 필요해 자동 감지하지 않습니다.
- **동적 분석 불가**: 런타임 동작, 상속 구조, 인터페이스 구현 여부는 정적 분석으로 확인할 수 없습니다.

---

## 라이선스

MIT
