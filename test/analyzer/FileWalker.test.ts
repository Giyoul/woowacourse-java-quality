import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { collectJavaFiles } from '../../src/analyzer/FileWalker';

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'java-quality-test-'));
}

describe('FileWalker', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('빈 디렉토리면 빈 배열 반환', () => {
    expect(collectJavaFiles(tmpDir)).toHaveLength(0);
  });

  it('Java 파일만 수집', () => {
    fs.writeFileSync(path.join(tmpDir, 'Main.java'), '');
    fs.writeFileSync(path.join(tmpDir, 'config.xml'), '');
    fs.writeFileSync(path.join(tmpDir, 'notes.txt'), '');
    const files = collectJavaFiles(tmpDir);
    expect(files).toHaveLength(1);
    expect(files[0]).toContain('Main.java');
  });

  it('하위 디렉토리도 재귀 탐색', () => {
    const subDir = path.join(tmpDir, 'domain');
    fs.mkdirSync(subDir);
    fs.writeFileSync(path.join(subDir, 'Game.java'), '');
    const files = collectJavaFiles(tmpDir);
    expect(files).toHaveLength(1);
    expect(files[0]).toContain('Game.java');
  });

  it('단일 Java 파일 경로를 직접 전달 가능', () => {
    const filePath = path.join(tmpDir, 'Player.java');
    fs.writeFileSync(filePath, '');
    const files = collectJavaFiles(filePath);
    expect(files).toHaveLength(1);
    expect(files[0]).toBe(filePath);
  });

  it('non-Java 단일 파일 경로는 빈 배열', () => {
    const filePath = path.join(tmpDir, 'readme.md');
    fs.writeFileSync(filePath, '');
    expect(collectJavaFiles(filePath)).toHaveLength(0);
  });

  it('Test.java 파일은 수집하지 않음', () => {
    fs.writeFileSync(path.join(tmpDir, 'Game.java'), '');
    fs.writeFileSync(path.join(tmpDir, 'GameTest.java'), '');
    const files = collectJavaFiles(tmpDir);
    expect(files).toHaveLength(1);
    expect(files[0]).toContain('Game.java');
  });

  it('Tests.java 파일도 수집하지 않음', () => {
    fs.writeFileSync(path.join(tmpDir, 'Player.java'), '');
    fs.writeFileSync(path.join(tmpDir, 'PlayerTests.java'), '');
    expect(collectJavaFiles(tmpDir)).toHaveLength(1);
  });

  it('test/ 디렉토리는 탐색하지 않음', () => {
    const testDir = path.join(tmpDir, 'test');
    fs.mkdirSync(testDir);
    fs.writeFileSync(path.join(tmpDir, 'Game.java'), '');
    fs.writeFileSync(path.join(testDir, 'GameTest.java'), '');
    const files = collectJavaFiles(tmpDir);
    expect(files).toHaveLength(1);
    expect(files[0]).toContain('Game.java');
  });

  it('src/test/ 구조에서도 test 디렉토리는 건너뜀', () => {
    const srcDir = path.join(tmpDir, 'src');
    const mainDir = path.join(srcDir, 'main');
    const testDir = path.join(srcDir, 'test');
    fs.mkdirSync(mainDir, { recursive: true });
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(path.join(mainDir, 'Game.java'), '');
    fs.writeFileSync(path.join(testDir, 'GameTest.java'), '');
    const files = collectJavaFiles(tmpDir);
    expect(files).toHaveLength(1);
    expect(files[0]).toContain('Game.java');
  });
});
