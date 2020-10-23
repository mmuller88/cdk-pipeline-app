#!/usr/bin/env node
import { App, AppProps, Construct } from '@aws-cdk/core';
import { PipelineStackProps, PipelineStack } from './pipeline-stack';
import { CustomStack } from './custom-stack';

import { Account, StageAccount } from './accountConfig';

export interface PipelineAppProps extends AppProps {
  // customStage: Stage;
  stageAccounts: StageAccount[];
  buildAccount: Account;
  customStack: (scope: Construct, stageAccount: StageAccount) => CustomStack;
  branch: string;
  repositoryName: string;
  /**
   * Optional Build Command during the Synth Action
   */
  buildCommand?: string;
  manualApprovals?: (stageAccount: StageAccount) => boolean;
  testCommands: (stageAccount: StageAccount) => string[];
}

export class PipelineApp extends App {
  constructor(props: PipelineAppProps) {
    super(props);
    // Tags.of(this).add('Project', props.repositoryName);

    // tslint:disable-next-line: forin
    for(const stageAccounts of props.stageAccounts) {
      props.customStack.call(this, this, stageAccounts);
    }

    const pipelineStackProps: PipelineStackProps = {
      customStack: props.customStack,
      // customStack: (_scope, account) => {
      //   return props.customStack(this, account);
      // },
      env: {
        account: props.buildAccount.id,
        region: props.buildAccount.region,
      },
      branch: props.branch,
      repositoryName: props.repositoryName,
      stageAccounts: props.stageAccounts,
      buildCommand: props.buildCommand,
      manualApprovals: props.manualApprovals,
      testCommands: props.testCommands,
    };
    console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);

    // tslint:disable-next-line: no-unused-expression
    new PipelineStack(this, `${props.repositoryName}-pipeline`, pipelineStackProps);
    this.synth();
  }
}
