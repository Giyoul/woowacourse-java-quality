import { SwitchCaseRule } from '../../src/analyzer/rules/SwitchCaseRule';

const rule = new SwitchCaseRule();

describe('SwitchCaseRule', () => {
  it('switch/case 없으면 위반 없음', () => {
    const lines = ['if (x) {', '    doA();', '}'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('switch 키워드 위반 검출', () => {
    const lines = ['switch (status) {'];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe('switch-case');
    expect(violations[0].line).toBe(1);
  });

  it('case 키워드 위반 검출', () => {
    const lines = ['    case ACTIVE:'];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].line).toBe(1);
  });

  it('주석 내 switch는 위반 아님', () => {
    const lines = ['// switch 대신 if를 사용하세요'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('문자열 내 switch는 위반 아님', () => {
    const lines = ['String msg = "switch is not allowed";'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });
});
