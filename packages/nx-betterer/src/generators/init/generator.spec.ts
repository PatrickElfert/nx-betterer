import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/node';


import generator from './generator';
import { NxBettererGeneratorSchema } from './schema';

describe('nx-betterer generator', () => {
  let tree: Tree;
  const options: NxBettererGeneratorSchema = { project: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config.targets?.betterer.executor).toBe('@pelfert/nx-betterer:nx-betterer');
    expect(tree.exists('betterer.base.ts')).toBeTruthy();
    expect(tree.exists(`${config.root}/.betterer.ts`)).toBeTruthy();
  });
});
