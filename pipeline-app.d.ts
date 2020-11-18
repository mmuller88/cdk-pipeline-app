#!/usr/bin/env node
import { App, AppProps, Construct, SecretValue } from "@aws-cdk/core";
import { CustomStack } from "./custom-stack";
import { Account, StageAccount } from "./accountConfig";
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
    /**
     * Access credentials for using the pipe with github. Other git providers are currently not supported.
     */
    gitHub: {
        owner: string;
        oauthToken: SecretValue;
    };
    manualApprovals?: (stageAccount: StageAccount) => boolean;
    testCommands: (stageAccount: StageAccount) => string[];
}
export declare class PipelineApp extends App {
    constructor(props: PipelineAppProps);
}
