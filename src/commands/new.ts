import {Command, flags} from '@oclif/command';
import axios from 'axios';
import * as extractArchive from 'extract-zip';
import * as fs from 'fs';
import * as path from 'path';
import { GitHubRelease } from '../util/data';

export default class NewCommand extends Command {
  
  static description = 'Create a new Kaktus application';

  static args = [{
    name: 'appName',
    required: true,
    description: 'Your application name'
  }];

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    const { args, flags } = this.parse(NewCommand);
    const absolutePath = path.resolve(process.cwd(), args.appName);
    const kaktusPath = path.resolve(absolutePath, 'kaktus.zip');

    try {
      fs.mkdirSync(absolutePath);
      const releaseFile = await this.fetchReleaseArchive();
      fs.writeFileSync(kaktusPath, releaseFile);
      const extractedDir = await this.extractReleaseArchive(absolutePath, kaktusPath);
      this.log('Generating application');
      this.moveFiles(path.resolve(absolutePath, extractedDir), absolutePath);
      this.deleteDirectory(extractedDir);
      fs.unlinkSync(kaktusPath);
      this.log(`Done !`);
    } catch (err) {
      this.error(`Could not create application : ${JSON.stringify((err as Error).message)}`);
    }
    this.log(`Creating Kaktus application in "${absolutePath}"`);
  }

  private async fetchReleaseArchive(): Promise<ArrayBuffer> {
    const releaseRes = await axios.get<GitHubRelease>('https://api.github.com/repos/Lelberto/kaktus/releases/latest');
    this.log(`Downloading Kaktus latest release from ${releaseRes.data.zipball_url}`);
    const fileRes = await axios.get<ArrayBuffer>(releaseRes.data.zipball_url, { responseType: 'arraybuffer' });
    return fileRes.data;
  }

  private async extractReleaseArchive(dirPath: string, archiveName: string): Promise<string> {
    this.log(`Extracting archive`);
    await extractArchive(path.resolve(dirPath, archiveName), { dir: dirPath });
    return fs.readdirSync(dirPath).find(filePath => filePath.startsWith('Lelberto-kaktus-')) as string;
  }

  private moveFiles(sourcePath: string, destinationPath: string): void {
    // TODO Error in ".xxx" files
    // TODO Make recursive move for subfolders of Kaktus application
    fs.readdirSync(sourcePath).forEach(filePath => {
      fs.renameSync(filePath, path.resolve(destinationPath, filePath));
    });
  }

  private deleteDirectory(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach(filePath => {
        if (fs.lstatSync(filePath).isDirectory()) {
          this.deleteDirectory(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
      });
      fs.rmdirSync(dirPath);
    }
  }
}
