#!/usr/bin/env node
import { App, AppProps, Construct, SecretValue } from "@aws-cdk/core";
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
    gitHub: {
        owner: string;
        oauthToken: SecretValue;
    };
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
export declare class PipelineApp extends App {
    constructor(props: PipelineAppProps);
}
