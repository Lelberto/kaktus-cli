import { exec } from 'child_process';

/**
 * Runs a command.
 * 
 * @param cmd Command to run
 * @param onData When a data is written in the given command's output.
 * @returns Exit code
 */
export async function run(cmd: string, onData: (data: string) => void): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const proc = exec(cmd);
    proc.stdout.on('data', data => onData(data.toString()));
    proc.on('exit', code => resolve(code));
    proc.on('error', err => reject(err));
  });
}
