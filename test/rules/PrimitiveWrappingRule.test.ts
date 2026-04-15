import { PrimitiveWrappingRule } from '../../src/analyzer/rules/PrimitiveWrappingRule';

const rule = new PrimitiveWrappingRule();

describe('PrimitiveWrappingRule', () => {
  it('래퍼 타입 사용하면 위반 없음', () => {
    const lines = [
      'public class Player {',
      '    private final Name name;',
      '    private final Position position;',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('인스턴스 변수에 int 사용 위반', () => {
    const lines = [
      'public class Score {',
      '    private int value;',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe('primitive-wrapping');
    expect(violations[0].line).toBe(2);
  });

  it('인스턴스 변수에 String 사용 위반', () => {
    const lines = [
      'public class Name {',
      '    private String value;',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(1);
  });

  it('boolean 인스턴스 변수 위반', () => {
    const lines = [
      'public class Flag {',
      '    private boolean active;',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(1);
  });

  it('static final 상수는 위반 아님', () => {
    const lines = [
      'public class Config {',
      '    private static final int MAX_COUNT = 10;',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('탭 들여쓰기로 된 int 필드도 위반 검출', () => {
    const lines = [
      'public class Config {',
      '\tprivate int value;',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(1);
  });

  it('로컬 변수는 위반 아님 (들여쓰기 더 깊음)', () => {
    const lines = [
      'public class Test {',
      '    public void run() {',
      '        int count = 0;',
      '    }',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });
});
