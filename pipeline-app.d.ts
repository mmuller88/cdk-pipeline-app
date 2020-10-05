#!/usr/bin/env node
import { App, AppProps, Construct } from '@aws-cdk/core';
import { Account } from './accountConfig';
import { CustomStack } from './custom-stack';
export interface PipelineAppProps extends AppProps {
    customStack: (scope: Construct, account: Account) => CustomStack;
    branch: string;
    repositoryName: string;
    testCommands: string[];
}
export declare class PipelineApp extends App {
    constructor(props: PipelineAppProps);
}
