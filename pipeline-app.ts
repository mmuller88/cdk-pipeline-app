#!/usr/bin/env node
import { App, AppProps, Construct } from '@aws-cdk/core';
import { PipelineStackProps, PipelineStack } from './pipeline-stack';
import { CustomStack } from './custom-stack';

import { Account, devAccount, prodAccount } from './accountConfig';

export interface PipelineAppProps extends AppProps {
  // customStage: Stage;
  customStack: (scope: Construct, account: Account) => CustomStack;
  branch: string;
  repositoryName: string;
  destroyStack?: boolean;
  testCommands: (account: Account) => string[];
}

export class PipelineApp extends App {
  constructor(props: PipelineAppProps) {
    super(props);
    // Tags.of(this).add('Project', props.repositoryName);

    for(const account of [devAccount, prodAccount]) {
      props.customStack.call(this, this, account);
    }

    const pipelineStackProps: PipelineStackProps = {
      customStack: props.customStack,
      // customStack: (_scope, account) => {
      //   return props.customStack(this, account);
      // },
      env: {
        account: devAccount.id,
        region: devAccount.region,
      },
      branch: props.branch,
      repositoryName: props.repositoryName,
      destroyStack: props.destroyStack,
      testCommands: props.testCommands,
    };
    console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);

    // tslint:disable-next-line: no-unused-expression
    new PipelineStack(this, `${props.repositoryName}-pipeline-stack-build`, pipelineStackProps);
    this.synth();
  }
}
