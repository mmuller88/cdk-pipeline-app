import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { CloudFormationDeleteStackAction, GitHubSourceAction } from '@aws-cdk/aws-codepipeline-actions';
import { App, Stack, StackProps, SecretValue, Tags, Construct, CfnOutput } from '@aws-cdk/core';
import { CdkPipeline, ShellScriptAction, SimpleSynthAction, StackOutput } from "@aws-cdk/pipelines";
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket';
import { dependencies } from './package.json';
import { CustomStage } from './custom-stage';
import { Account } from './accountConfig';
import { CustomStack } from './custom-stack';


export interface PipelineStackProps extends StackProps {
  // customStage: Stage;
  customStack: (scope: Construct, account: Account) => CustomStack;
  // customStack: CustomStack;
  accounts: Account[];
  branch: string;
  repositoryName: string;
  destroyStack?: (account: Account) => boolean;
  manualApprovals?: (account: Account) => boolean;
  testCommands: (account: Account, cfnOutputs: Record<string, CfnOutput>) => string[];
}

export class PipelineStack extends Stack {
  constructor(app: App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    Tags.of(this).add('PipelineStack', this.stackName);

    const oauth = SecretValue.secretsManager('alfcdk', {
      jsonField: 'muller88-github-token',
    });

    const sourceBucket = new AutoDeleteBucket(this, 'PipeBucket', {
      versioned: true,
    });

    const pipeline = new Pipeline(this, 'Pipeline', {
      artifactBucket: sourceBucket,
      restartExecutionOnUpdate: true,
    });

    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const cdkPipeline = new CdkPipeline(this, 'CdkPipeline', {
      // The pipeline name
      // pipelineName: `${this.stackName}-pipeline`,
      cloudAssemblyArtifact,
      codePipeline: pipeline,

      // Where the source can be found
      sourceAction: new GitHubSourceAction({
        actionName: 'GithubSource',
        branch: props.branch,
        owner: 'mmuller88',
        repo: props.repositoryName,
        oauthToken: oauth,
        output: sourceArtifact,
      }),

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        installCommand: `npm install -g aws-cdk@${dependencies['@aws-cdk/core']}`,
        synthCommand: 'make cdksynthprod',
        // subdirectory: 'cdk',
        // We need a build step to compile the TypeScript Lambda
        // buildCommand: 'make build && make cdkbuild',
      }),
    });

    // todo: add devAccount later
    for (const account of props.accounts) {

      const customStage = new CustomStage(this, `CustomStage-${account.stage}`, {
        customStack: props.customStack,
        // customStack: (_scope, account) => {
        //   return props.customStack(this, account);
        // },
        env: {
          account: account.id,
          region: account.region,
        }
      }, account);

      // console.log('customStage = ' + customStage);

      const preprodStage = cdkPipeline.addApplicationStage(customStage, { manualApprovals: props.manualApprovals?.call(this, account) });

      const useOutputs: Record<string, StackOutput> = {};
      const useValueOutputs: Record<string, CfnOutput> = {};

      // tslint:disable-next-line: forin
      for(const cfnOutput in customStage.cfnOutputs){
        useOutputs[cfnOutput] = cdkPipeline.stackOutput(customStage.cfnOutputs[cfnOutput]);
        useValueOutputs[cfnOutput] = customStage.cfnOutputs[cfnOutput];
      }

      const testStage = cdkPipeline.addStage(`TestCustomStack-${account.stage}`);
      testStage.addActions(new ShellScriptAction({
        additionalArtifacts: [sourceArtifact],
        actionName: 'TestCustomStack',
        useOutputs,
        commands: [],
        // commands: props.testCommands.call(this, account, useValueOutputs),
        // commands: props.testCommands.call(this, account, customStage.cfnOutputs),
        runOrder: preprodStage.nextSequentialRunOrder(),
      }), ...(props.destroyStack?.call(this, account) ? [new CloudFormationDeleteStackAction({
        actionName: 'DestroyStack',
        stackName: `${props.repositoryName}-${account.stage}`,
        adminPermissions: true,
        runOrder: preprodStage.nextSequentialRunOrder()
      })] : []));
    }
  }
}
