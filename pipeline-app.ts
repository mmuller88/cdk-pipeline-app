#!/usr/bin/env node
import { App, AppProps, Construct, SecretValue } from "@aws-cdk/core";
import { PipelineStackProps, PipelineStack } from "./pipeline-stack";
import { CustomStack } from "./custom-stack";

import { Account, StageAccount } from "./accountConfig";

export interface PipelineAppProps extends AppProps {
  /**
   * The accounts you want to deploy you stack into, managed by the pipeline
   */
  stageAccounts: StageAccount[];
  /**
   * The build account where you want the pipeline to be created. It can have the same account id / region as one of the stage accounts
   */
  buildAccount: Account;
  /**
   * The CDK Stack you would like to create and managed by CDK Pipeline
   */
  customStack: (scope: Construct, stageAccount: StageAccount) => CustomStack;
  /**
   * The git branch you would like to be managed by CDK Pipeline
   */
  branch: string;
  /**
   * The repository name of your repo in GitHub
   */
  repositoryName: string;
  /**
   * Optional Build Command during the Synth Action
   */
  buildCommand?: string;
  /**
   * Access credentials for using the pipe with github. Other git providers are currently not supported.
   */
  gitHub: { owner: string; oauthToken: SecretValue };
  /**
   * Manual approval action in the pipeline to approve or reject the CDK deploy.
   *
   * @default return is false.
   */
  manualApprovals?: (stageAccount: StageAccount) => boolean;
  /**
   * Run tests after the pipeline was created. You can use CfnOutput here to be available for your tests like 'curl -Ssf $InstancePublicDnsName'
   */
  testCommands: (stageAccount: StageAccount) => string[];
}

export class PipelineApp extends App {
  constructor(props: PipelineAppProps) {
    super(props);
    // Tags.of(this).add('Project', props.repositoryName);

    // tslint:disable-next-line: forin
    for (const stageAccounts of props.stageAccounts) {
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
      gitHub: props.gitHub,
      manualApprovals: props.manualApprovals,
      testCommands: props.testCommands,
    };
    console.info(
      `pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`
    );

    // tslint:disable-next-line: no-unused-expression
    new PipelineStack(
      this,
      `${props.repositoryName}-pipeline`,
      pipelineStackProps
    );
    this.synth();
  }
}
