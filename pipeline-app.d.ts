#!/usr/bin/env node
import { App, AppProps, Construct } from '@aws-cdk/core';
import { CustomStack } from './custom-stack';
import { Account } from './accountConfig';
export interface PipelineAppProps extends AppProps {
    accounts: Account[];
    buildAccount: Account;
    customStack: (scope: Construct, account: Account) => CustomStack;
    branch: string;
    repositoryName: string;
    manualApprovals?: (account: Account) => boolean;
    testCommands: (account: Account) => string[];
}
export declare class PipelineApp extends App {
    constructor(props: PipelineAppProps);
}
