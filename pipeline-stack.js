"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStack = void 0;
const aws_codepipeline_1 = require("@aws-cdk/aws-codepipeline");
const aws_codepipeline_actions_1 = require("@aws-cdk/aws-codepipeline-actions");
const core_1 = require("@aws-cdk/core");
const pipelines_1 = require("@aws-cdk/pipelines");
const auto_delete_bucket_1 = require("@mobileposse/auto-delete-bucket");
const package_json_1 = require("./package.json");
const custom_stage_1 = require("./custom-stage");
class PipelineStack extends core_1.Stack {
    constructor(app, id, props) {
        var _a, _b;
        super(app, id, props);
        core_1.Tags.of(this).add('PipelineStack', this.stackName);
        const oauth = core_1.SecretValue.secretsManager('alfcdk', {
            jsonField: 'muller88-github-token',
        });
        const sourceBucket = new auto_delete_bucket_1.AutoDeleteBucket(this, 'PipeBucket', {
            versioned: true,
        });
        const pipeline = new aws_codepipeline_1.Pipeline(this, 'Pipeline', {
            artifactBucket: sourceBucket,
            restartExecutionOnUpdate: true,
        });
        const sourceArtifact = new aws_codepipeline_1.Artifact();
        const cloudAssemblyArtifact = new aws_codepipeline_1.Artifact();
        const cdkPipeline = new pipelines_1.CdkPipeline(this, 'CdkPipeline', {
            // The pipeline name
            // pipelineName: `${this.stackName}-pipeline`,
            cloudAssemblyArtifact,
            codePipeline: pipeline,
            // Where the source can be found
            sourceAction: new aws_codepipeline_actions_1.GitHubSourceAction({
                actionName: 'GithubSource',
                branch: props.branch,
                owner: 'mmuller88',
                repo: props.repositoryName,
                oauthToken: oauth,
                output: sourceArtifact,
            }),
            // How it will be built and synthesized
            synthAction: pipelines_1.SimpleSynthAction.standardNpmSynth({
                sourceArtifact,
                cloudAssemblyArtifact,
                installCommand: `npm install -g aws-cdk@${package_json_1.dependencies['@aws-cdk/core']}`,
                synthCommand: 'make cdksynthprod',
            }),
        });
        // todo: add devAccount later
        for (const account of props.accounts) {
            const customStage = new custom_stage_1.CustomStage(this, `CustomStage-${account.stage}`, {
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
            const preprodStage = cdkPipeline.addApplicationStage(customStage, { manualApprovals: (_a = props.manualApprovals) === null || _a === void 0 ? void 0 : _a.call(this, account) });
            const useOutputs = {};
            const useValueOutputs = {};
            // tslint:disable-next-line: forin
            for (const cfnOutput in customStage.cfnOutputs) {
                useOutputs[cfnOutput] = cdkPipeline.stackOutput(customStage.cfnOutputs[cfnOutput]);
                useValueOutputs[cfnOutput] = new String(customStage.cfnOutputs[cfnOutput]);
            }
            preprodStage.addActions(new pipelines_1.ShellScriptAction({
                additionalArtifacts: [sourceArtifact],
                actionName: 'TestCustomStack',
                useOutputs,
                // commands: [],
                commands: props.testCommands.call(this, account, useValueOutputs),
                // commands: props.testCommands.call(this, account, customStage.cfnOutputs),
                runOrder: preprodStage.nextSequentialRunOrder(),
            }), ...(((_b = props.destroyStack) === null || _b === void 0 ? void 0 : _b.call(this, account)) ? [new aws_codepipeline_actions_1.CloudFormationDeleteStackAction({
                    actionName: 'DestroyStack',
                    stackName: `${props.repositoryName}-${account.stage}`,
                    adminPermissions: true,
                    runOrder: preprodStage.nextSequentialRunOrder()
                })] : []));
        }
    }
}
exports.PipelineStack = PipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBK0Q7QUFDL0QsZ0ZBQXdHO0FBQ3hHLHdDQUFxRjtBQUNyRixrREFBb0c7QUFDcEcsd0VBQW1FO0FBQ25FLGlEQUE4QztBQUM5QyxpREFBNkM7QUFpQjdDLE1BQWEsYUFBYyxTQUFRLFlBQUs7SUFDdEMsWUFBWSxHQUFRLEVBQUUsRUFBVSxFQUFFLEtBQXlCOztRQUN6RCxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QixXQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sS0FBSyxHQUFHLGtCQUFXLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtZQUNqRCxTQUFTLEVBQUUsdUJBQXVCO1NBQ25DLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUkscUNBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM1RCxTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxjQUFjLEVBQUUsWUFBWTtZQUM1Qix3QkFBd0IsRUFBRSxJQUFJO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksMkJBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7UUFFN0MsTUFBTSxXQUFXLEdBQUcsSUFBSSx1QkFBVyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdkQsb0JBQW9CO1lBQ3BCLDhDQUE4QztZQUM5QyxxQkFBcUI7WUFDckIsWUFBWSxF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aWZhY3QsIFBpcGVsaW5lIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgeyBDbG91ZEZvcm1hdGlvbkRlbGV0ZVN0YWNrQWN0aW9uLCBHaXRIdWJTb3VyY2VBY3Rpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcywgU2VjcmV0VmFsdWUsIFRhZ3MsIENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2RrUGlwZWxpbmUsIFNoZWxsU2NyaXB0QWN0aW9uLCBTaW1wbGVTeW50aEFjdGlvbiwgU3RhY2tPdXRwdXQgfSBmcm9tIFwiQGF3cy1jZGsvcGlwZWxpbmVzXCI7XG5pbXBvcnQgeyBBdXRvRGVsZXRlQnVja2V0IH0gZnJvbSAnQG1vYmlsZXBvc3NlL2F1dG8tZGVsZXRlLWJ1Y2tldCc7XG5pbXBvcnQgeyBkZXBlbmRlbmNpZXMgfSBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBDdXN0b21TdGFnZSB9IGZyb20gJy4vY3VzdG9tLXN0YWdlJztcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICcuL2FjY291bnRDb25maWcnO1xuaW1wb3J0IHsgQ3VzdG9tU3RhY2sgfSBmcm9tICcuL2N1c3RvbS1zdGFjayc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgLy8gY3VzdG9tU3RhZ2U6IFN0YWdlO1xuICBjdXN0b21TdGFjazogKHNjb3BlOiBDb25zdHJ1Y3QsIGFjY291bnQ6IEFjY291bnQpID0+IEN1c3RvbVN0YWNrO1xuICAvLyBjdXN0b21TdGFjazogQ3VzdG9tU3RhY2s7XG4gIGFjY291bnRzOiBBY2NvdW50W107XG4gIGJyYW5jaDogc3RyaW5nO1xuICByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuICBkZXN0cm95U3RhY2s/OiAoYWNjb3VudDogQWNjb3VudCkgPT4gYm9vbGVhbjtcbiAgbWFudWFsQXBwcm92YWxzPzogKGFjY291bnQ6IEFjY291bnQpID0+IGJvb2xlYW47XG4gIHRlc3RDb21tYW5kczogKGFjY291bnQ6IEFjY291bnQsIGNmbk91dHB1dHM6IFJlY29yZDxzdHJpbmcsIFN0cmluZz4pID0+IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzOiBQaXBlbGluZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihhcHAsIGlkLCBwcm9wcyk7XG5cbiAgICBUYWdzLm9mKHRoaXMpLmFkZCgnUGlwZWxpbmVTdGFjaycsIHRoaXMuc3RhY2tOYW1lKTtcblxuICAgIGNvbnN0IG9hdXRoID0gU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2FsZmNkaycsIHtcbiAgICAgIGpzb25GaWVsZDogJ211bGxlcjg4LWdpdGh1Yi10b2tlbicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgQXV0b0RlbGV0ZUJ1Y2tldCh0aGlzLCAnUGlwZUJ1Y2tldCcsIHtcbiAgICAgIHZlcnNpb25lZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IFBpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIGFydGlmYWN0QnVja2V0OiBzb3VyY2VCdWNrZXQsXG4gICAgICByZXN0YXJ0RXhlY3V0aW9uT25VcGRhdGU6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3VyY2VBcnRpZmFjdCA9IG5ldyBBcnRpZmFjdCgpO1xuICAgIGNvbnN0IGNsb3VkQXNzZW1ibHlBcnRpZmFjdCA9IG5ldyBBcnRpZmFjdCgpO1xuXG4gICAgY29uc3QgY2RrUGlwZWxpbmUgPSBuZXcgQ2RrUGlwZWxpbmUodGhpcywgJ0Nka1BpcGVsaW5lJywge1xuICAgICAgLy8gVGhlIHBpcGVsaW5lIG5hbWVcbiAgICAgIC8vIHBpcGVsaW5lTmFtZTogYCR7dGhpcy5zdGFja05hbWV9LXBpcGVsaW5lYCxcbiAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgIGNvZGVQaXBlbGluZTogcGlwZWxpbmUsXG5cbiAgICAgIC8vIFdoZXJlIHRoZSBzb3VyY2UgY2FuIGJlIGZvdW5kXG4gICAgICBzb3VyY2VBY3Rpb246IG5ldyBHaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnR2l0aHViU291cmNlJyxcbiAgICAgICAgYnJhbmNoOiBwcm9wcy5icmFuY2gsXG4gICAgICAgIG93bmVyOiAnbW11bGxlcjg4JyxcbiAgICAgICAgcmVwbzogcHJvcHMucmVwb3NpdG9yeU5hbWUsXG4gICAgICAgIG9hdXRoVG9rZW46IG9hdXRoLFxuICAgICAgICBvdXRwdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgfSksXG5cbiAgICAgIC8vIEhvdyBpdCB3aWxsIGJlIGJ1aWx0IGFuZCBzeW50aGVzaXplZFxuICAgICAgc3ludGhBY3Rpb246IFNpbXBsZVN5bnRoQWN0aW9uLnN0YW5kYXJkTnBtU3ludGgoe1xuICAgICAgICBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuICAgICAgICBpbnN0YWxsQ29tbWFuZDogYG5wbSBpbnN0YWxsIC1nIGF3cy1jZGtAJHtkZXBlbmRlbmNpZXNbJ0Bhd3MtY2RrL2NvcmUnXX1gLFxuICAgICAgICBzeW50aENvbW1hbmQ6ICdtYWtlIGNka3N5bnRocHJvZCcsXG4gICAgICAgIC8vIHN1YmRpcmVjdG9yeTogJ2NkaycsXG4gICAgICAgIC8vIFdlIG5lZWQgYSBidWlsZCBzdGVwIHRvIGNvbXBpbGUgdGhlIFR5cGVTY3JpcHQgTGFtYmRhXG4gICAgICAgIC8vIGJ1aWxkQ29tbWFuZDogJ21ha2UgYnVpbGQgJiYgbWFrZSBjZGtidWlsZCcsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIHRvZG86IGFkZCBkZXZBY2NvdW50IGxhdGVyXG4gICAgZm9yIChjb25zdCBhY2NvdW50IG9mIHByb3BzLmFjY291bnRzKSB7XG5cbiAgICAgIGNvbnN0IGN1c3RvbVN0YWdlID0gbmV3IEN1c3RvbVN0YWdlKHRoaXMsIGBDdXN0b21TdGFnZS0ke2FjY291bnQuc3RhZ2V9YCwge1xuICAgICAgICBjdXN0b21TdGFjazogcHJvcHMuY3VzdG9tU3RhY2ssXG4gICAgICAgIC8vIGN1c3RvbVN0YWNrOiAoX3Njb3BlLCBhY2NvdW50KSA9PiB7XG4gICAgICAgIC8vICAgcmV0dXJuIHByb3BzLmN1c3RvbVN0YWNrKHRoaXMsIGFjY291bnQpO1xuICAgICAgICAvLyB9LFxuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiBhY2NvdW50LmlkLFxuICAgICAgICAgIHJlZ2lvbjogYWNjb3VudC5yZWdpb24sXG4gICAgICAgIH1cbiAgICAgIH0sIGFjY291bnQpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnY3VzdG9tU3RhZ2UgPSAnICsgY3VzdG9tU3RhZ2UpO1xuXG4gICAgICBjb25zdCBwcmVwcm9kU3RhZ2UgPSBjZGtQaXBlbGluZS5hZGRBcHBsaWNhdGlvblN0YWdlKGN1c3RvbVN0YWdlLCB7IG1hbnVhbEFwcHJvdmFsczogcHJvcHMubWFudWFsQXBwcm92YWxzPy5jYWxsKHRoaXMsIGFjY291bnQpIH0pO1xuXG4gICAgICBjb25zdCB1c2VPdXRwdXRzOiBSZWNvcmQ8c3RyaW5nLCBTdGFja091dHB1dD4gPSB7fTtcbiAgICAgIGNvbnN0IHVzZVZhbHVlT3V0cHV0czogUmVjb3JkPHN0cmluZywgU3RyaW5nPiA9IHt9O1xuXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGZvcmluXG4gICAgICBmb3IoY29uc3QgY2ZuT3V0cHV0IGluIGN1c3RvbVN0YWdlLmNmbk91dHB1dHMpe1xuICAgICAgICB1c2VPdXRwdXRzW2Nmbk91dHB1dF0gPSBjZGtQaXBlbGluZS5zdGFja091dHB1dChjdXN0b21TdGFnZS5jZm5PdXRwdXRzW2Nmbk91dHB1dF0pO1xuICAgICAgICB1c2VWYWx1ZU91dHB1dHNbY2ZuT3V0cHV0XSA9IG5ldyBTdHJpbmcoY3VzdG9tU3RhZ2UuY2ZuT3V0cHV0c1tjZm5PdXRwdXRdKTtcbiAgICAgIH1cblxuICAgICAgcHJlcHJvZFN0YWdlLmFkZEFjdGlvbnMobmV3IFNoZWxsU2NyaXB0QWN0aW9uKHtcbiAgICAgICAgYWRkaXRpb25hbEFydGlmYWN0czogW3NvdXJjZUFydGlmYWN0XSxcbiAgICAgICAgYWN0aW9uTmFtZTogJ1Rlc3RDdXN0b21TdGFjaycsXG4gICAgICAgIHVzZU91dHB1dHMsXG4gICAgICAgIC8vIGNvbW1hbmRzOiBbXSxcbiAgICAgICAgY29tbWFuZHM6IHByb3BzLnRlc3RDb21tYW5kcy5jYWxsKHRoaXMsIGFjY291bnQsIHVzZVZhbHVlT3V0cHV0cyksXG4gICAgICAgIC8vIGNvbW1hbmRzOiBwcm9wcy50ZXN0Q29tbWFuZHMuY2FsbCh0aGlzLCBhY2NvdW50LCBjdXN0b21TdGFnZS5jZm5PdXRwdXRzKSxcbiAgICAgICAgcnVuT3JkZXI6IHByZXByb2RTdGFnZS5uZXh0U2VxdWVudGlhbFJ1bk9yZGVyKCksXG4gICAgICB9KSwgLi4uKHByb3BzLmRlc3Ryb3lTdGFjaz8uY2FsbCh0aGlzLCBhY2NvdW50KSA/IFtuZXcgQ2xvdWRGb3JtYXRpb25EZWxldGVTdGFja0FjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdEZXN0cm95U3RhY2snLFxuICAgICAgICBzdGFja05hbWU6IGAke3Byb3BzLnJlcG9zaXRvcnlOYW1lfS0ke2FjY291bnQuc3RhZ2V9YCxcbiAgICAgICAgYWRtaW5QZXJtaXNzaW9uczogdHJ1ZSxcbiAgICAgICAgcnVuT3JkZXI6IHByZXByb2RTdGFnZS5uZXh0U2VxdWVudGlhbFJ1bk9yZGVyKClcbiAgICAgIH0pXSA6IFtdKSk7XG4gICAgfVxuICB9XG59XG4iXX0=