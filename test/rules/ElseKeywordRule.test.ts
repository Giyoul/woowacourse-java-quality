import { ElseKeywordRule } from '../../src/analyzer/rules/ElseKeywordRule';

const rule = new ElseKeywordRule();

describe('ElseKeywordRule', () => {
  it('else 키워드가 없으면 위반 없음', () => {
    const lines = [
      'if (condition) {',
      '    return true;',
      '}',
      'return false;',
    ];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('} else { 패턴 위반 검출', () => {
    const lines = ['if (x) {', '    doA();', '} else {', '    doB();', '}'];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].line).toBe(3);
    expect(violations[0].ruleId).toBe('else-keyword');
  });

  it('else if 패턴도 위반 검출', () => {
    const lines = ['if (x) {', '    doA();', '} else if (y) {', '    doB();', '}'];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(1);
    expect(violations[0].line).toBe(3);
  });

  it('주석 내 else는 위반 아님', () => {
    const lines = ['// else 사용하면 안됨', '/* else example */'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('문자열 리터럴 내 else는 위반 아님', () => {
    const lines = ['String msg = "use else carefully";'];
    expect(rule.check(lines, 'Test.java')).toHaveLength(0);
  });

  it('여러 else가 있으면 각각 위반 검출', () => {
    const lines = [
      'if (a) { } else { }',
      'if (b) { } else { }',
    ];
    const violations = rule.check(lines, 'Test.java');
    expect(violations).toHaveLength(2);
  });
});
