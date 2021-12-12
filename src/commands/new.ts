import { Command, flags } from '@oclif/command';
import axios from 'axios';
import * as path from 'path';
import * as command from '../util/command';
import { GitHubRelease } from '../util/data';
import * as files from '../util/files';

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
    const appPath = path.resolve(process.cwd(), args.appName);
    const archivePath = path.resolve(appPath, 'kaktus.zip');

    this.log(`Creating Kaktus application in "${appPath}"`);
    try {
      files.createDirectory(appPath);
      const releaseArchive = await this.fetchReleaseArchive();
      files.write(archivePath, releaseArchive);
      const extractDirPath = await files.extractArchive(archivePath, appPath, { exclude: ['package-lock.json', 'LICENCE'] });
      this.log('Generating application');
      files.moveDirectory(extractDirPath, appPath);
      files.deleteDirectory(extractDirPath);
      files.unlink(archivePath);
      process.chdir(appPath);
      files.move('.example.env', '.env');
      this.log('Executing "npm install"');
      await command.run('npm install', data => this.log(data));
      this.log('Done !');
    } catch (err) {
      this.error(`Could not create application : ${err}`);
    }
  }

  private async fetchReleaseArchive(): Promise<ArrayBuffer> {
    const releaseRes = await axios.get<GitHubRelease>('https://api.github.com/repos/Lelberto/kaktus/releases/latest');
    this.log(`Downloading latest Kaktus release from ${releaseRes.data.zipball_url}`);
    const fileRes = await axios.get<ArrayBuffer>(releaseRes.data.zipball_url, { responseType: 'arraybuffer' });
    return fileRes.data;
  }
}
