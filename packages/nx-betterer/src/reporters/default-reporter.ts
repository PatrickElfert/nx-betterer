// src/html-reporter.ts
import {
  BettererReporter,
  BettererRun,
  BettererRunSummary,
} from '@betterer/betterer';
import { logger } from 'nx/src/utils/logger';

export const reporter: BettererReporter = createDefaultReporter();

function createDefaultReporter(): BettererReporter {
  return {
    runStart(run, lifecycle) {  
      logRun(run);
      lifecycle.then((runSummary) => {
        logRunSummary(runSummary);
      })
    },
  };
}

function logRun({name}: BettererRun): void {
  logger.log(`Running ${name}...`);
}

function logRunSummary({name, isComplete, isNew, isSame, isWorse}: BettererRunSummary): void {
  if(isComplete) {
    logger.log(`${name} already meets the target!`);
  }
  else if(isNew) {
    logger.log(`${name} ran for the first time!`);
  }
  else if(isSame) {
    logger.log(`${name} stayed the same!`);
  }
  else if(isWorse) {
    logger.log(`${name} got worse!`);
  }
}
