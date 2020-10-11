#!/usr/bin/env node
import { App, AppProps, CfnOutput, Construct } from '@aws-cdk/core';
import { PipelineStackProps, PipelineStack } from './pipeline-stack';
import { CustomStack } from './custom-stack';

import { Account } from './accountConfig';

export interface PipelineAppProps extends AppProps {
  // customStage: Stage;
  accounts: Account[];
  buildAccount: Account;
  customStack: (scope: Construct, account: Account) => CustomStack;
  branch: string;
  repositoryName: string;
  destroyStack?: (account: Account) => boolean;
  manualApprovals?: (account: Account) => boolean;
  testCommands: (account: Account, cfnOutputs: Record<string, CfnOutput>) => string[];
}

export class PipelineApp extends App {
  constructor(props: PipelineAppProps) {
    super(props);
    // Tags.of(this).add('Project', props.repositoryName);

    // tslint:disable-next-line: forin
    for(const account of props.accounts) {
      props.customStack.call(this, this, account);
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
      accounts: props.accounts,
      destroyStack: props.destroyStack,
      manualApprovals: props.manualApprovals,
      testCommands: props.testCommands,
    };
    console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);

    // tslint:disable-next-line: no-unused-expression
    new PipelineStack(this, `${props.repositoryName}-pipeline-stack-build`, pipelineStackProps);
    this.synth();
  }
}
