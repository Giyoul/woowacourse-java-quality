import { InstanceVariablesRule } from '../../src/analyzer/rules/InstanceVariablesRule';

const rule = new InstanceVariablesRule();

describe('InstanceVariablesRule', () => {
  it('인스턴스 변수 2개 이하면 위반 없음', () => {
    const lines = [
      'public class Player {',
      '    private final Name name;',
      '    private final Position position;',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('인스턴스 변수 3개면 위반 검출', () => {
    const lines = [
      'public class Player {',
      '    private final Name name;',
      '    private final Position position;',
      '    private final Score score;',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe('instance-variables');
  });

  it('static 필드는 인스턴스 변수로 카운트 안 함', () => {
    const lines = [
      'public class Config {',
      '    private static final int MAX = 10;',
      '    private final Name name;',
      '    private final Position position;',
      '}',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('여러 클래스 중 초과한 클래스만 위반', () => {
    const lines = [
      'public class Small {',
      '    private final Name name;',
      '}',
      'public class Large {',
      '    private final Name name;',
      '    private final Position position;',
      '    private final Score score;',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].snippet).toContain('Large');
  });

  it('중첩 내부 클래스도 독립적으로 검사', () => {
    const lines = [
      'public class Outer {',
      '    private final Name name;',
      '    private class Inner {',
      '        private int x;',
      '        private int y;',
      '        private int z;',
      '    }',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].snippet).toContain('Inner');
  });

  it('위반 시 클래스 선언 줄 번호를 보고', () => {
    const lines = [
      'public class Big {',
      '    private A a;',
      '    private B b;',
      '    private C c;',
      '}',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations[0].line).toBe(1);
  });
});
