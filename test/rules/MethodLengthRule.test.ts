import { MethodLengthRule } from '../../src/analyzer/rules/MethodLengthRule';

const rule = new MethodLengthRule();

function makeMethod(bodyLines: string[]): string[] {
  return [
    'public class Test {',
    '    public void doSomething() {',
    ...bodyLines.map(l => `        ${l}`),
    '    }',
    '}',
  ];
}

describe('MethodLengthRule', () => {
  it('메서드 바디 10줄 이하면 위반 없음', () => {
    const body = Array.from({ length: 10 }, (_, i) => `int x${i} = ${i};`);
    expect(rule.check(makeMethod(body), 'Test.java')).toHaveLength(0);
  });

  it('메서드 바디 11줄이면 위반 검출', () => {
    const body = Array.from({ length: 11 }, (_, i) => `int x${i} = ${i};`);
    const violations = rule.check(makeMethod(body), 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe('method-length');
  });

  it('위반 시 메서드 선언 줄 번호를 보고', () => {
    const body = Array.from({ length: 11 }, (_, i) => `int x${i} = ${i};`);
    const violations = rule.check(makeMethod(body), 'Test.java');
    expect(violations[0].line).toBe(2);
  });

  it('빈 줄은 라인 수에 포함', () => {
    const body = Array.from({ length: 9 }, (_, i) => `int x${i} = ${i};`);
    body.push('');
    body.push('return;');
    const violations = rule.check(makeMethod(body), 'Test.java');
    expect(violations).toHaveLength(1);
  });

  it('문자열 내 중괄호는 라인 수 계산에 영향 없음', () => {
    const lines = [
      'public class Test {',
      '    public void doSomething() {',
      ...Array.from({ length: 9 }, (_, i) => i === 0
        ? `        String open = "{";`
        : `        int x${i} = ${i};`
      ),
      '    }',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('멀티라인 시그니처도 감지', () => {
    const lines = [
      'public class Test {',
      '    public void doSomething(',
      '            String paramOne,',
      '            String paramTwo) throws IOException {',
      ...Array.from({ length: 11 }, (_, i) => `        int x${i} = ${i};`),
      '    }',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
  });

  it('throws 절 있는 시그니처도 감지', () => {
    const lines = [
      'public class Test {',
      '    public void run() throws IOException {',
      ...Array.from({ length: 11 }, (_, i) => `        int x${i} = ${i};`),
      '    }',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(1);
  });

  it('여러 메서드 중 긴 것만 위반', () => {
    const lines = [
      'public class Test {',
      '    public void shortMethod() {',
      '        return;',
      '    }',
      '    public void longMethod() {',
      ...Array.from({ length: 11 }, (_, i) => `        int x${i} = ${i};`),
      '    }',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].snippet).toContain('longMethod');
  });
});
