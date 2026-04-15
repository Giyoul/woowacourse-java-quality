import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { analyzeFile } from '../../src/analyzer/JavaFileAnalyzer';

function writeJava(dir: string, name: string, content: string): string {
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

describe('JavaFileAnalyzer', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'java-analyzer-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('위반 없는 파일은 빈 violations 반환', () => {
    const filePath = writeJava(tmpDir, 'Clean.java', [
      'public class Clean {',
      '    private final Name name;',
      '    public void run() {',
      '        name.display();',
      '    }',
      '}',
    ].join('\n'));
    const result = analyzeFile(filePath);
    expect(result.filePath).toBe(filePath);
    expect(result.violations).toHaveLength(0);
  });

  it('else 사용 파일은 위반 검출', () => {
    const filePath = writeJava(tmpDir, 'Bad.java', [
      'public class Bad {',
      '    public void run() {',
      '        if (x) {',
      '            doA();',
      '        } else {',
      '            doB();',
      '        }',
      '    }',
      '}',
    ].join('\n'));
    const result = analyzeFile(filePath);
    const elseViolations = result.violations.filter(v => v.ruleId === 'else-keyword');
    expect(elseViolations).toHaveLength(1);
  });

  it('블록 주석 내부 코드는 무시', () => {
    const filePath = writeJava(tmpDir, 'Commented.java', [
      'public class Commented {',
      '    /*',
      '     * } else {',
      '     * switch (x) {',
      '     */',
      '    public void run() {}',
      '}',
    ].join('\n'));
    const result = analyzeFile(filePath);
    const elseViolations = result.violations.filter(v => v.ruleId === 'else-keyword');
    const switchViolations = result.violations.filter(v => v.ruleId === 'switch-case');
    expect(elseViolations).toHaveLength(0);
    expect(switchViolations).toHaveLength(0);
  });
});
