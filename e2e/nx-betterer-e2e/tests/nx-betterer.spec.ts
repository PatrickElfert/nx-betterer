import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync, runPackageManagerInstall,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('nx-betterer e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@patrickelfert/nx-betterer', 'dist/packages/nx-betterer');
    runPackageManagerInstall();
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should create nx-betterer', async () => {
    const project = uniq('nx-betterer');
    await runNxCommandAsync(`generate @nrwl/workspace:library --name ${project}`);
    await runNxCommandAsync(
      `generate @patrickelfert/nx-betterer:init --project ${project}`
    );
    await runNxCommandAsync(
      `betterer ${project}`
    );
    expect(() =>
      checkFilesExist(`libs/${project}/.betterer.ts`, `betterer.base.ts`)
    ).not.toThrow();
  }, 120000);
});
