import * as fs from 'fs';
import * as path from 'path';

export function collectJavaFiles(targetPath: string): string[] {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return targetPath.endsWith('.java') ? [targetPath] : [];
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
    return walkDirectory(fullPath);
  }
  if (entry.isFile() && entry.name.endsWith('.java')) {
    return [fullPath];
  }
  return [];
}
