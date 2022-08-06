import {
  formatFiles,
  generateFiles,
  offsetFromRoot, readProjectConfiguration,
  Tree, updateProjectConfiguration,
} from '@nrwl/devkit';
import * as path from 'path';
import { NxBettererGeneratorSchema } from './schema';

interface NormalizedSchema extends NxBettererGeneratorSchema {
  projectRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: NxBettererGeneratorSchema
): NormalizedSchema {

  const projectConfig = readProjectConfiguration(tree, options.project);

  return {
    ...options,
    projectRoot: projectConfig.root
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    bettererBaseConfigPath: `${offsetFromRoot(options.projectRoot)}betterer.base`,
    tmpl: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files/projectFiles'),
    options.projectRoot,
    templateOptions
  );

  generateFiles(
    tree,
    path.join(__dirname, 'files/rootFiles'),
    './',
    templateOptions
  );
}

function addBettererTarget(tree: Tree, normalizedOptions: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, normalizedOptions.project);
  projectConfig.targets = {
    ...projectConfig.targets,
    betterer: {
     executor: '@patrickelfert/nx-betterer:run',
    }
  }
  updateProjectConfiguration(tree, normalizedOptions.project, projectConfig);
}

export default async function (tree: Tree, options: NxBettererGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addBettererTarget(tree, normalizedOptions);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
