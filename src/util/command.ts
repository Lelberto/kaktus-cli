import { exec } from 'child_process';

export async function run(cmd: string, onData: (data: string) => void): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const proc = exec(cmd);
    proc.stdout.on('data', data => onData(data.toString()));
    proc.on('exit', code => resolve(code));
    proc.on('error', err => reject(err));
  });
}
