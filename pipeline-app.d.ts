#!/usr/bin/env node
import { App, AppProps, CfnOutput, Construct } from '@aws-cdk/core';
import { CustomStack } from './custom-stack';
import { Account } from './accountConfig';
export interface PipelineAppProps extends AppProps {
    accounts: Account[];
    buildAccount: Account;
    customStack: (scope: Construct, account: Account) => CustomStack;
    branch: string;
    repositoryName: string;
    destroyStack?: (account: Account) => boolean;
    manualApprovals?: (account: Account) => boolean;
    testCommands: (account: Account, cfnOutputs?: Record<string, CfnOutput>) => string[];
}
export declare class PipelineApp extends App {
    constructor(props: PipelineAppProps);
}
