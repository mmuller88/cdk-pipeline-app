import { App, Stack, StackProps, Construct } from '@aws-cdk/core';
import { StageAccount } from './accountConfig';
import { CustomStack } from './custom-stack';
export interface PipelineStackProps extends StackProps {
    customStack: (scope: Construct, stageAccount: StageAccount) => CustomStack;
    stageAccounts: StageAccount[];
    branch: string;
    repositoryName: string;
    buildCommand?: string;
    manualApprovals?: (stageAccount: StageAccount) => boolean;
    testCommands: (stageAccount: StageAccount) => string[];
}
export declare class PipelineStack extends Stack {
    constructor(app: App, id: string, props: PipelineStackProps);
}
