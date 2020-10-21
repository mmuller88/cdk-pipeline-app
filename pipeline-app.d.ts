#!/usr/bin/env node
import { App, AppProps, Construct } from '@aws-cdk/core';
import { CustomStack } from './custom-stack';
import { Account, StageAccount } from './accountConfig';
export interface PipelineAppProps extends AppProps {
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
export declare class PipelineApp extends App {
    constructor(props: PipelineAppProps);
}
