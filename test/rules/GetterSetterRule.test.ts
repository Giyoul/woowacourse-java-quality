import { GetterSetterRule } from '../../src/analyzer/rules/GetterSetterRule';

const rule = new GetterSetterRule();

describe('GetterSetterRule', () => {
  it('setter 없으면 위반 없음', () => {
    const lines = ['    public String display() {', '        return name.value();', '    }'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('getter는 위반 아님', () => {
    const lines = ['    public String getName() {'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('setName() 패턴 위반 검출', () => {
    const lines = ['    public void setName(String name) {'];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe('setter');
    expect(violations[0].line).toBe(1);
  });

  it('setAge() 패턴 위반 검출', () => {
    const lines = ['    public void setAge(int age) {'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(1);
  });

  it('set으로 시작하지만 소문자 다음이면 위반 아님', () => {
    const lines = ['    public void setup() {'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('주석 내 setter 패턴은 위반 아님', () => {
    const lines = ['    // public void setName(String name) {'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });
});
