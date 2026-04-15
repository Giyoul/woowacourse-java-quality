import { IndentDepthRule } from '../../src/analyzer/rules/IndentDepthRule';

const rule = new IndentDepthRule();

describe('IndentDepthRule', () => {
  it('depth 1 이하면 위반 없음', () => {
    const lines = [
      'public class Test {',
      '    public void run() {',
      '        if (x) {',
      '            return;',
      '        }',
      '    }',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('depth 2 위반 검출: if 안에 if', () => {
    const lines = [
      'public class Test {',
      '    public void run() {',
      '        if (x) {',
      '            if (y) {',
      '                return;',
      '            }',
      '        }',
      '    }',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations.length).toBeGreaterThanOrEqual(1);
    expect(violations[0].ruleId).toBe('indent-depth');
  });

  it('depth 2 위반 검출: while 안에 if', () => {
    const lines = [
      'public class Test {',
      '    public void run() {',
      '        while (list.hasNext()) {',
      '            if (list.next() > 0) {',
      '                count++;',
      '            }',
      '        }',
      '    }',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations.length).toBeGreaterThanOrEqual(1);
  });

  it('for 안에 if도 depth 2 위반', () => {
    const lines = [
      'public class Test {',
      '    public void run() {',
      '        for (int i = 0; i < 10; i++) {',
      '            if (i > 5) {',
      '                doSomething();',
      '            }',
      '        }',
      '    }',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations.length).toBeGreaterThanOrEqual(1);
  });

  it('단일 if는 depth 1이므로 위반 아님', () => {
    const lines = [
      'public class Test {',
      '    public void run() {',
      '        if (x) {',
      '            doSomething();',
      '        }',
      '    }',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });
});
