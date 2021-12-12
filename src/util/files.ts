import extract = require('extract-zip');
import { existsSync, fstatSync, lstatSync, mkdirSync, readdirSync, renameSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export function write<T>(filePath: string, data?: T): void {
  writeFileSync(filePath, data);
}

export function unlink(filePath: string): void {
  unlinkSync(filePath);
}

export function move(fileSourcePath: string, fileDestinationPath: string): void {
  renameSync(fileSourcePath, fileDestinationPath);
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
      move(fileSourcePath, fileDestPath);
    }
  }
}

export function isDirectory(path: string): boolean {
  return lstatSync(path).isDirectory();
}

export async function extractArchive(archivePath: string, destPath: string, options: ExtractArchiveOptions = { exclude: [] }): Promise<string> {
  let archiveDirPath: string = '';
  await extract(archivePath, {
    dir: destPath,
    onEntry: ({ fileName,  }) => {
      if (archiveDirPath === '') {
        archiveDirPath = fileName.substring(0, fileName.indexOf('/'));
      }
    }
  });
  for (let excludedPath of options.exclude) {
    excludedPath = resolve(destPath, archiveDirPath, excludedPath);
    if (isDirectory(excludedPath)) {
      deleteDirectory(excludedPath);
    } else {
      unlink(excludedPath);
    }
  }
  return resolve(destPath, archiveDirPath);
}

interface ExtractArchiveOptions {
  exclude: string[];
}
