import { App, Stack, StackProps, Construct } from '@aws-cdk/core';
import { StackOutput } from "@aws-cdk/pipelines";
import { Account } from './accountConfig';
import { CustomStack } from './custom-stack';
export interface PipelineStackProps extends StackProps {
    customStack: (scope: Construct, account: Account) => CustomStack;
    accounts: Account[];
    branch: string;
    repositoryName: string;
    destroyStack?: (account: Account) => boolean;
    manualApprovals?: (account: Account) => boolean;
    testCommands: (account: Account, useOutputs: Record<string, StackOutput>) => string[];
}
export declare class PipelineStack extends Stack {
    constructor(app: App, id: string, props: PipelineStackProps);
}
