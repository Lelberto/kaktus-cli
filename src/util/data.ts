/**
 * GitHub API release data.
 */
export interface GitHubRelease {
  url: string;
  id: number;
  tag_name: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  tarball_url: string;
  zipball_url: string;
}
