import * as Bun from 'bun';

export class RapidhashGitRepo {
  readonly #repoUrl: string;
  readonly #dir: string;

  constructor(args: {repoUrl: string; dir: string}) {
    this.#repoUrl = args.repoUrl;
    this.#dir = args.dir;
  }

  pullOrClone(): void {
    if (this.#tryPull()) {
      return;
    }
    this.#clone();
  }

  #tryPull(): boolean {
    const proc = this.#exec(`git -C ${this.#dir} pull origin master`, {returnsEvenIfExitCodeIsNotZero: true});
    return proc.exitCode === 0;
  }

  #clone(): void {
    this.#exec(`git clone ${this.#repoUrl} ${this.#dir}`);
  }

  checkout(tag: string): string {
    this.#exec(`git -C ${this.#dir} checkout ${tag}`);
    const result = this.#exec(`git -C ${this.#dir} show --format='%H' --no-patch`, {pipeStdout: true});
    return result.stdout.toString().trim();
  }

  #exec<T extends boolean>(
    command: string,
    options?: {
      pipeStdout?: T;
      returnsEvenIfExitCodeIsNotZero?: boolean;
    },
  ): Bun.SyncSubprocess<T extends true ? 'pipe' : 'inherit'> {
    const proc = Bun.spawnSync(command.split(' '), {stdout: options?.pipeStdout ? 'pipe' : 'inherit'});

    if (proc.exitCode !== 0) {
      if (!options?.returnsEvenIfExitCodeIsNotZero) {
        throw new Error(`Failed to execute command: ${command}`);
      }
    }

    return proc;
  }
}

export const rapidhashGitRepo = new RapidhashGitRepo({
  repoUrl: 'https://github.com/Nicoshev/rapidhash.git',
  dir: 'src/rapidhash',
});
