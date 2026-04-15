import { TernaryOperatorRule } from '../../src/analyzer/rules/TernaryOperatorRule';

const rule = new TernaryOperatorRule();

describe('TernaryOperatorRule', () => {
  it('3항 연산자 없으면 위반 없음', () => {
    const lines = ['int x = 5;', 'String s = "hello";'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('3항 연산자 위반 검출', () => {
    const lines = ['int result = condition ? a : b;'];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].line).toBe(1);
    expect(violations[0].ruleId).toBe('ternary-operator');
  });

  it('문자열 내 ? : 는 위반 아님', () => {
    const lines = ['String msg = "condition ? a : b";'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('주석 내 3항 연산자는 위반 아님', () => {
    const lines = ['// result = x ? a : b'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('제네릭 ? 와이어카드는 위반 아님', () => {
    const lines = ['List<?> items = new ArrayList<>();'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('? 뒤에 콜론이 있어야 3항으로 판단', () => {
    const lines = ['if (map.containsKey("key?")) {'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('? extends 와일드카드는 위반 아님', () => {
    const lines = ['    List<? extends Number> numbers = new ArrayList<>();'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('? super 와일드카드는 위반 아님', () => {
    const lines = ['    List<? super Integer> items = new ArrayList<>();'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });
});
