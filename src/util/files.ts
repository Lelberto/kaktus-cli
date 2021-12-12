import extract = require('extract-zip');
import { existsSync, lstatSync, mkdirSync, readdirSync, renameSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Writes a file.
 * 
 * @param filePath Path to file
 * @param data Data to write
 */
export function write<T>(filePath: string, data?: T): void {
  writeFileSync(filePath, data);
}

/**
 * Deletes a file.
 * 
 * @param filePath File to delete
 */
export function unlink(filePath: string): void {
  unlinkSync(filePath);
}

/**
 * Moves a file.
 * 
 * @param fileSrcPath File source path
 * @param fileDestPath File destination path
 */
export function move(fileSrcPath: string, fileDestPath: string): void {
  renameSync(fileSrcPath, fileDestPath);
}

/**
 * Creates a new directory.
 * 
 * @param dirPath Path of directory to create
 */
export function createDirectory(dirPath: string): void {
  mkdirSync(dirPath);
}

/**
 * Deletes a directory.
 * 
 * @param dirPath Path of directory to delete
 */
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

/**
 * Moves a directory.
 * 
 * @param srcPath Directory source path
 * @param destPath Directory destination path
 */
export function moveDirectory(srcPath: string, destPath: string): void {
  for (const fileName of readdirSync(srcPath)) {
    const fileSourcePath = resolve(srcPath, fileName);
    const fileDestPath = resolve(destPath, fileName)
    if (lstatSync(fileSourcePath).isDirectory()) {
      createDirectory(fileDestPath);
      moveDirectory(fileSourcePath, fileDestPath);
      deleteDirectory(fileSourcePath);
    } else {
      move(fileSourcePath, fileDestPath);
    }
  }
}

/**
 * Checks if a path is a directory.
 * 
 * @param path Path to check
 * @returns True if the given path is a directory, false otherwise
 */
export function isDirectory(path: string): boolean {
  return lstatSync(path).isDirectory();
}

/**
 * Extracts an archive.
 * 
 * @param archivePath Archive path
 * @param destPath Destination path
 * @param options Extract options
 * @returns Path to the extracted archive directory
 */
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

/**
 * Extract archive options.
 */
interface ExtractArchiveOptions {
  /** Files or directories to exclude */
  exclude: string[];
}
