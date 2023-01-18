import { BuildExecutorSchema } from './schema';
import {betterer} from "@betterer/betterer";
import {ExecutorContext} from "nx/src/config/misc-interfaces";
import {BettererOptionsStart} from "@betterer/betterer/dist/config";
import {reporter} from '../../reporters/default-reporter';

type ExecutorOptions = BuildExecutorSchema & BettererOptionsStart;

export default async function runExecutor(options: ExecutorOptions, context: ExecutorContext) {
  console.log(`Running executor for ${context.projectName}`);
  const result = await betterer({
    ...options,
    cwd: `${context.root}/${context.workspace.projects[context.projectName].root}`,
    reporters: [reporter]
  });

  return {
    success: !(result.worse.length > 0 || (options.ci && result.changed.length > 0)),
  };}
