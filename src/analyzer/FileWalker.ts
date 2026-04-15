import * as fs from 'fs';
import * as path from 'path';

const TEST_DIRECTORY_NAMES = ['test', 'tests'];
const TEST_FILE_SUFFIXES = ['Test.java', 'Tests.java', 'Spec.java'];

export function collectJavaFiles(targetPath: string): string[] {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return isProductionJavaFile(targetPath) ? [targetPath] : [];
  }
  return walkDirectory(targetPath);
}

function walkDirectory(directory: string): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap(entry => resolveEntry(directory, entry));
}

function resolveEntry(directory: string, entry: fs.Dirent): string[] {
  const fullPath = path.join(directory, entry.name);
  if (entry.isDirectory()) {
    if (isTestDirectory(entry.name)) {
      return [];
    }
    return walkDirectory(fullPath);
  }
  if (entry.isFile() && isProductionJavaFile(entry.name)) {
    return [fullPath];
  }
  return [];
}

function isTestDirectory(name: string): boolean {
  return TEST_DIRECTORY_NAMES.includes(name.toLowerCase());
}

function isProductionJavaFile(filePath: string): boolean {
  const name = path.basename(filePath);
  if (!name.endsWith('.java')) {
    return false;
  }
  return !TEST_FILE_SUFFIXES.some(suffix => name.endsWith(suffix));
}
