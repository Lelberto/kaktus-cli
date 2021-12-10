import extract = require('extract-zip');
import { existsSync, fstatSync, lstatSync, mkdirSync, readdirSync, renameSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export function write<T>(filePath: string, data?: T): void {
  writeFileSync(filePath, data);
}

export function unlink(filePath: string): void {
  unlinkSync(filePath);
}

export function createDirectory(dirPath: string): void {
  mkdirSync(dirPath);
}

export function deleteDirectory(dirPath: string): void {
  if (existsSync(dirPath)) {
    readdirSync(dirPath).forEach(filePath => {
      if (lstatSync(filePath).isDirectory()) {
        deleteDirectory(filePath);
      } else {
        unlinkSync(filePath);
      }
    });
    rmdirSync(dirPath);
  }
}

export function moveDirectory(sourcePath: string, destinationPath: string): void {
  for (const fileName of readdirSync(sourcePath)) {
    const fileSourcePath = resolve(sourcePath, fileName);
    const fileDestPath = resolve(destinationPath, fileName)
    if (lstatSync(fileSourcePath).isDirectory()) {
      createDirectory(fileDestPath);
      moveDirectory(fileSourcePath, fileDestPath);
      deleteDirectory(fileSourcePath);
    } else {
      renameSync(fileSourcePath, fileDestPath);
    }
  }
}

export async function extractArchive(archivePath: string, destPath: string): Promise<string> {
  let archiveDirPath: string = '';
  await extract(archivePath, {
    dir: destPath,
    onEntry: ({ fileName }) => archiveDirPath = fileName.substring(0, fileName.indexOf('/'))
  });
  return resolve(destPath, archiveDirPath);
}
