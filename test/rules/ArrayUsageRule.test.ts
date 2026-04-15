import { ArrayUsageRule } from '../../src/analyzer/rules/ArrayUsageRule';

const rule = new ArrayUsageRule();

describe('ArrayUsageRule', () => {
  it('배열 없으면 위반 없음', () => {
    const lines = ['List<String> items = new ArrayList<>();'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('필드 선언에 배열 사용 위반', () => {
    const lines = ['    private int[] numbers;'];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe('array-usage');
    expect(violations[0].line).toBe(1);
  });

  it('String 배열 선언 위반', () => {
    const lines = ['    private String[] names;'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(1);
  });

  it('메서드 파라미터 배열 위반', () => {
    const lines = ['    public void process(int[] values) {'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(1);
  });

  it('주석 내 배열은 위반 아님', () => {
    const lines = ['// int[] arr = new int[10];'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('문자열 내 배열 표기는 위반 아님', () => {
    const lines = ['String msg = "use List instead of int[]";'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });
});
