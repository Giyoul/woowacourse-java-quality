import { UiSeparationRule } from '../../src/analyzer/rules/UiSeparationRule';

const rule = new UiSeparationRule();

describe('UiSeparationRule', () => {
  it('System.out.println 없으면 위반 없음', () => {
    const lines = ['    return name.value();'];
    expect(rule.check(lines, 'GameService.java')).toHaveLength(0);
  });

  it('비View 클래스에서 System.out 위반 검출', () => {
    const lines = ['    System.out.println("result");'];
    const violations = rule.check(lines, 'GameService.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe('ui-separation');
  });

  it('System.in 사용도 위반 검출', () => {
    const lines = ['    Scanner scanner = new Scanner(System.in);'];
    const violations = rule.check(lines, 'GameController.java');
    expect(violations).toHaveLength(1);
  });

  it('InputView 클래스는 위반 아님', () => {
    const lines = ['    System.out.println("enter:");'];
    expect(rule.check(lines, 'InputView.java')).toHaveLength(0);
  });

  it('ResultView 클래스는 위반 아님', () => {
    const lines = ['    System.out.println("result:");'];
    expect(rule.check(lines, 'ResultView.java')).toHaveLength(0);
  });

  it('OutputView 클래스는 위반 아님', () => {
    const lines = ['    System.out.println("output:");'];
    expect(rule.check(lines, 'OutputView.java')).toHaveLength(0);
  });

  it('주석 내 System.out은 위반 아님', () => {
    const lines = ['    // System.out.println("debug")'];
    expect(rule.check(lines, 'Service.java')).toHaveLength(0);
  });
});
