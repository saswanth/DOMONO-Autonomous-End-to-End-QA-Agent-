import { Octokit } from '@octokit/rest';
import { simpleGit } from 'simple-git';

/**
 * DOMONO Module 5 — GitHub Integrator.
 *
 * Commits generated/healed spec files to a dedicated branch and opens a
 * Pull Request against the base branch, using a GitHub Personal Access
 * Token (fine-grained PAT recommended; needs `contents:write` and
 * `pull_requests:write` on the target repo).
 */
export class GithubIntegrator {
  /**
   * @param {object} opts
   * @param {string} opts.token - GitHub PAT
   * @param {string} opts.owner
   * @param {string} opts.repo
   * @param {string} [opts.baseBranch]
   * @param {string} opts.featureBranch
   * @param {string} [opts.repoPath] - local path to the git working copy
   */
  constructor({ token, owner, repo, baseBranch = 'main', featureBranch, repoPath = process.cwd() }) {
    if (!token) throw new Error('GithubIntegrator requires a GitHub token.');
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.baseBranch = baseBranch;
    this.featureBranch = featureBranch;
    this.git = simpleGit(repoPath);
  }

  /** Creates (or resets) the feature branch locally from the base branch. */
  async createFeatureBranch() {
    await this.git.fetch('origin', this.baseBranch);
    await this.git.checkoutBranch(this.featureBranch, `origin/${this.baseBranch}`).catch(async () => {
      // Branch already exists locally; just switch to it.
      await this.git.checkout(this.featureBranch);
    });
  }

  /**
   * Stages given file paths, commits, and pushes the feature branch.
   * @param {string[]} filePaths
   * @param {string} commitMessage
   */
  async commitAndPush(filePaths, commitMessage) {
    await this.git.add(filePaths);
    await this.git.commit(commitMessage);
    await this.git.push(['-u', 'origin', this.featureBranch]);
  }

  /**
   * Opens a Pull Request from the feature branch into the base branch.
   * @param {object} opts
   * @param {string} opts.title
   * @param {string} opts.body
   */
  async openPullRequest({ title, body }) {
    const { data } = await this.octokit.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      head: this.featureBranch,
      base: this.baseBranch,
    });
    return data;
  }

  /** Full Module 5 publish flow: branch -> commit -> push -> PR. */
  async publish({ filePaths, commitMessage, prTitle, prBody }) {
    await this.createFeatureBranch();
    await this.commitAndPush(filePaths, commitMessage);
    return this.openPullRequest({ title: prTitle, body: prBody });
  }
}
