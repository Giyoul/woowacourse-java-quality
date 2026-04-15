import { DotsPerLineRule } from '../../src/analyzer/rules/DotsPerLineRule';

const rule = new DotsPerLineRule();

describe('DotsPerLineRule', () => {
  it('점 하나면 위반 없음', () => {
    const lines = ['    player.move();'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('점 0개면 위반 없음', () => {
    const lines = ['    int x = 5;'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('점 2개면 위반 검출', () => {
    const lines = ['    player.position().move();'];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe('dots-per-line');
    expect(violations[0].line).toBe(1);
  });

  it('소수점은 제외', () => {
    const lines = ['    double pi = 3.14;'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('주석 내 점은 제외', () => {
    const lines = ['    // player.board().move()'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('문자열 내 점은 제외', () => {
    const lines = ['    String s = "a.b.c";'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('import 문은 제외', () => {
    const lines = ['import java.util.List;'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });
});
