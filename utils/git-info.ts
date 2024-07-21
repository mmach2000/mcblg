import { execa } from 'execa';
import { formatISO } from 'date-fns';

export async function getGitCreated(filePath: string): Promise<string | undefined> {
  try {
    // Thanks to https://stackoverflow.com/a/25633731
    const cmd = await execa('git', [
      'log',
      '--diff-filter=A',
      '--follow',
      '--format=%at',
      '-1',
      filePath,
    ]);
    if (!cmd.stdout) {
      return undefined;
    }
    return formatISO(new Date(Number(cmd.stdout) * 1000));
  } catch {
    return undefined;
  }
}

export async function getGitLastUpdated(filePath: string): Promise<{
  lastUpdatedHash: string;
  lastUpdated: string;
} | undefined> {
  try {
    const cmd = await execa('git', [
      'log',
      '--format=%h %at',
      '-1',
      filePath,
    ]);
    if (!cmd.stdout) {
      return undefined;
    }
    const [lastUpdatedHash, timestamp] = cmd.stdout.split(' ');
    const lastUpdated = formatISO(new Date(Number(timestamp) * 1000));
    return { lastUpdatedHash, lastUpdated };
  } catch {
    return undefined;
  }
}
