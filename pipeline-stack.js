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
            // tslint:disable-next-line: forin
            for (const cfnOutput in customStage.cfnOutputs) {
                useOutputs[cfnOutput] = cdkPipeline.stackOutput(customStage.cfnOutputs[cfnOutput]);
            }
            preprodStage.addActions(new pipelines_1.ShellScriptAction({
                additionalArtifacts: [sourceArtifact],
                actionName: 'TestCustomStack',
                useOutputs,
                commands: props.testCommands.call(this, account, customStage.cfnOutputs),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBK0Q7QUFDL0QsZ0ZBQXdHO0FBQ3hHLHdDQUFnRztBQUNoRyxrREFBb0c7QUFDcEcsd0VBQW1FO0FBQ25FLGlEQUE4QztBQUM5QyxpREFBNkM7QUFpQjdDLE1BQWEsYUFBYyxTQUFRLFlBQUs7SUFDdEMsWUFBWSxHQUFRLEVBQUUsRUFBVSxFQUFFLEtBQXlCOztRQUN6RCxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QixXQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sS0FBSyxHQUFHLGtCQUFXLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtZQUNqRCxTQUFTLEVBQUUsdUJBQXVCO1NBQ25DLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUkscUNBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM1RCxTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxjQUFjLEVBQUUsWUFBWTtZQUM1Qix3QkFBd0IsRUFBRSxJQUFJO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksMkJBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7UUFFN0MsTUFBTSxXQUFXLEdBQUcsSUFBSSx1QkFBVyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdkQsb0JBQW9CO1lBQ3BCLDhDQUE4QztZQUM5QyxxQkFBcUI7WUFDckIsWUFBWSxFQUFFLFFBQVE7WUFFdEIsZ0NBQWdDO1lBQ2hDLFlBQVksRUFBRSxJQUFJLDZDQUFrQixDQUFDO2dCQUNuQyxVQUFVLEVBQUUsY0FBYztnQkFDMUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO2dCQUNwQixLQUFLLEVBQUUsV0FBVztnQkFDbEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxjQUFjO2dCQUMxQixVQUFVLEVBQUUsS0FBSztnQkFDakIsTUFBTSxFQUFFLGNBQWM7YUFDdkIsQ0FBQztZQUVGLHVDQUF1QztZQUN2QyxXQUFXLEVBQUUsNkJBQWlCLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzlDLGNBQWM7Z0JBQ2QscUJBQXFCO2dCQUNyQixjQUFjLEVBQUUsMEJBQTBCLDJCQUFZLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ3pFLFlBQVksRUFBRSxtQkFBbUI7YUFJbEMsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILDZCQUE2QjtRQUM3QixLQUFLLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFFcEMsTUFBTSxXQUFXLEdBQUcsSUFBSSwwQkFBVyxDQUFDLElBQUksRUFBRSxlQUFlLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDeEUsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM5QixzQ0FBc0M7Z0JBQ3RDLDZDQUE2QztnQkFDN0MsS0FBSztnQkFDTCxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFO29CQUNuQixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07aUJBQ3ZCO2FBQ0YsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUVaLCtDQUErQztZQUUvQyxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLEVBQUUsZUFBZSxRQUFFLEtBQUssQ0FBQyxlQUFlLDBDQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRW5JLE1BQU0sVUFBVSxHQUFnQyxFQUFFLENBQUM7WUFFbkQsa0NBQWtDO1lBQ2xDLEtBQUksTUFBTSxTQUFTLElBQUksV0FBVyxDQUFDLFVBQVUsRUFBQztnQkFDNUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBQ3BGO1lBRUQsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLDZCQUFpQixDQUFDO2dCQUM1QyxtQkFBbUIsRUFBRSxDQUFDLGNBQWMsQ0FBQztnQkFDckMsVUFBVSxFQUFFLGlCQUFpQjtnQkFDN0IsVUFBVTtnQkFDVixRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDO2dCQUN4RSxRQUFRLEVBQUUsWUFBWSxDQUFDLHNCQUFzQixFQUFFO2FBQ2hELENBQUMsRUFBRSxHQUFHLENBQUMsT0FBQSxLQUFLLENBQUMsWUFBWSwwQ0FBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sR0FBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLDBEQUErQixDQUFDO29CQUNyRixVQUFVLEVBQUUsY0FBYztvQkFDMUIsU0FBUyxFQUFFLEdBQUcsS0FBSyxDQUFDLGNBQWMsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO29CQUNyRCxnQkFBZ0IsRUFBRSxJQUFJO29CQUN0QixRQUFRLEVBQUUsWUFBWSxDQUFDLHNCQUFzQixFQUFFO2lCQUNoRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNaO0lBQ0gsQ0FBQztDQUNGO0FBekZELHNDQXlGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFydGlmYWN0LCBQaXBlbGluZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgQ2xvdWRGb3JtYXRpb25EZWxldGVTdGFja0FjdGlvbiwgR2l0SHViU291cmNlQWN0aW9uIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMsIFNlY3JldFZhbHVlLCBUYWdzLCBDb25zdHJ1Y3QsIENmbk91dHB1dCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2RrUGlwZWxpbmUsIFNoZWxsU2NyaXB0QWN0aW9uLCBTaW1wbGVTeW50aEFjdGlvbiwgU3RhY2tPdXRwdXQgfSBmcm9tIFwiQGF3cy1jZGsvcGlwZWxpbmVzXCI7XG5pbXBvcnQgeyBBdXRvRGVsZXRlQnVja2V0IH0gZnJvbSAnQG1vYmlsZXBvc3NlL2F1dG8tZGVsZXRlLWJ1Y2tldCc7XG5pbXBvcnQgeyBkZXBlbmRlbmNpZXMgfSBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBDdXN0b21TdGFnZSB9IGZyb20gJy4vY3VzdG9tLXN0YWdlJztcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICcuL2FjY291bnRDb25maWcnO1xuaW1wb3J0IHsgQ3VzdG9tU3RhY2sgfSBmcm9tICcuL2N1c3RvbS1zdGFjayc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgLy8gY3VzdG9tU3RhZ2U6IFN0YWdlO1xuICBjdXN0b21TdGFjazogKHNjb3BlOiBDb25zdHJ1Y3QsIGFjY291bnQ6IEFjY291bnQpID0+IEN1c3RvbVN0YWNrO1xuICAvLyBjdXN0b21TdGFjazogQ3VzdG9tU3RhY2s7XG4gIGFjY291bnRzOiBBY2NvdW50W107XG4gIGJyYW5jaDogc3RyaW5nO1xuICByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuICBkZXN0cm95U3RhY2s/OiAoYWNjb3VudDogQWNjb3VudCkgPT4gYm9vbGVhbjtcbiAgbWFudWFsQXBwcm92YWxzPzogKGFjY291bnQ6IEFjY291bnQpID0+IGJvb2xlYW47XG4gIHRlc3RDb21tYW5kczogKGFjY291bnQ6IEFjY291bnQsIGNmbk91dHB1dHM/OiBSZWNvcmQ8c3RyaW5nLCBDZm5PdXRwdXQ+KSA9PiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBpZDogc3RyaW5nLCBwcm9wczogUGlwZWxpbmVTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoYXBwLCBpZCwgcHJvcHMpO1xuXG4gICAgVGFncy5vZih0aGlzKS5hZGQoJ1BpcGVsaW5lU3RhY2snLCB0aGlzLnN0YWNrTmFtZSk7XG5cbiAgICBjb25zdCBvYXV0aCA9IFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCdhbGZjZGsnLCB7XG4gICAgICBqc29uRmllbGQ6ICdtdWxsZXI4OC1naXRodWItdG9rZW4nLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IEF1dG9EZWxldGVCdWNrZXQodGhpcywgJ1BpcGVCdWNrZXQnLCB7XG4gICAgICB2ZXJzaW9uZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBhcnRpZmFjdEJ1Y2tldDogc291cmNlQnVja2V0LFxuICAgICAgcmVzdGFydEV4ZWN1dGlvbk9uVXBkYXRlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QgPSBuZXcgQXJ0aWZhY3QoKTtcblxuICAgIGNvbnN0IGNka1BpcGVsaW5lID0gbmV3IENka1BpcGVsaW5lKHRoaXMsICdDZGtQaXBlbGluZScsIHtcbiAgICAgIC8vIFRoZSBwaXBlbGluZSBuYW1lXG4gICAgICAvLyBwaXBlbGluZU5hbWU6IGAke3RoaXMuc3RhY2tOYW1lfS1waXBlbGluZWAsXG4gICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICBjb2RlUGlwZWxpbmU6IHBpcGVsaW5lLFxuXG4gICAgICAvLyBXaGVyZSB0aGUgc291cmNlIGNhbiBiZSBmb3VuZFxuICAgICAgc291cmNlQWN0aW9uOiBuZXcgR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0dpdGh1YlNvdXJjZScsXG4gICAgICAgIGJyYW5jaDogcHJvcHMuYnJhbmNoLFxuICAgICAgICBvd25lcjogJ21tdWxsZXI4OCcsXG4gICAgICAgIHJlcG86IHByb3BzLnJlcG9zaXRvcnlOYW1lLFxuICAgICAgICBvYXV0aFRva2VuOiBvYXV0aCxcbiAgICAgICAgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgIH0pLFxuXG4gICAgICAvLyBIb3cgaXQgd2lsbCBiZSBidWlsdCBhbmQgc3ludGhlc2l6ZWRcbiAgICAgIHN5bnRoQWN0aW9uOiBTaW1wbGVTeW50aEFjdGlvbi5zdGFuZGFyZE5wbVN5bnRoKHtcbiAgICAgICAgc291cmNlQXJ0aWZhY3QsXG4gICAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgICAgaW5zdGFsbENvbW1hbmQ6IGBucG0gaW5zdGFsbCAtZyBhd3MtY2RrQCR7ZGVwZW5kZW5jaWVzWydAYXdzLWNkay9jb3JlJ119YCxcbiAgICAgICAgc3ludGhDb21tYW5kOiAnbWFrZSBjZGtzeW50aHByb2QnLFxuICAgICAgICAvLyBzdWJkaXJlY3Rvcnk6ICdjZGsnLFxuICAgICAgICAvLyBXZSBuZWVkIGEgYnVpbGQgc3RlcCB0byBjb21waWxlIHRoZSBUeXBlU2NyaXB0IExhbWJkYVxuICAgICAgICAvLyBidWlsZENvbW1hbmQ6ICdtYWtlIGJ1aWxkICYmIG1ha2UgY2RrYnVpbGQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyB0b2RvOiBhZGQgZGV2QWNjb3VudCBsYXRlclxuICAgIGZvciAoY29uc3QgYWNjb3VudCBvZiBwcm9wcy5hY2NvdW50cykge1xuXG4gICAgICBjb25zdCBjdXN0b21TdGFnZSA9IG5ldyBDdXN0b21TdGFnZSh0aGlzLCBgQ3VzdG9tU3RhZ2UtJHthY2NvdW50LnN0YWdlfWAsIHtcbiAgICAgICAgY3VzdG9tU3RhY2s6IHByb3BzLmN1c3RvbVN0YWNrLFxuICAgICAgICAvLyBjdXN0b21TdGFjazogKF9zY29wZSwgYWNjb3VudCkgPT4ge1xuICAgICAgICAvLyAgIHJldHVybiBwcm9wcy5jdXN0b21TdGFjayh0aGlzLCBhY2NvdW50KTtcbiAgICAgICAgLy8gfSxcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogYWNjb3VudC5pZCxcbiAgICAgICAgICByZWdpb246IGFjY291bnQucmVnaW9uLFxuICAgICAgICB9XG4gICAgICB9LCBhY2NvdW50KTtcblxuICAgICAgLy8gY29uc29sZS5sb2coJ2N1c3RvbVN0YWdlID0gJyArIGN1c3RvbVN0YWdlKTtcblxuICAgICAgY29uc3QgcHJlcHJvZFN0YWdlID0gY2RrUGlwZWxpbmUuYWRkQXBwbGljYXRpb25TdGFnZShjdXN0b21TdGFnZSwgeyBtYW51YWxBcHByb3ZhbHM6IHByb3BzLm1hbnVhbEFwcHJvdmFscz8uY2FsbCh0aGlzLCBhY2NvdW50KSB9KTtcblxuICAgICAgY29uc3QgdXNlT3V0cHV0czogUmVjb3JkPHN0cmluZywgU3RhY2tPdXRwdXQ+ID0ge307XG5cbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZm9yaW5cbiAgICAgIGZvcihjb25zdCBjZm5PdXRwdXQgaW4gY3VzdG9tU3RhZ2UuY2ZuT3V0cHV0cyl7XG4gICAgICAgIHVzZU91dHB1dHNbY2ZuT3V0cHV0XSA9IGNka1BpcGVsaW5lLnN0YWNrT3V0cHV0KGN1c3RvbVN0YWdlLmNmbk91dHB1dHNbY2ZuT3V0cHV0XSk7XG4gICAgICB9XG5cbiAgICAgIHByZXByb2RTdGFnZS5hZGRBY3Rpb25zKG5ldyBTaGVsbFNjcmlwdEFjdGlvbih7XG4gICAgICAgIGFkZGl0aW9uYWxBcnRpZmFjdHM6IFtzb3VyY2VBcnRpZmFjdF0sXG4gICAgICAgIGFjdGlvbk5hbWU6ICdUZXN0Q3VzdG9tU3RhY2snLFxuICAgICAgICB1c2VPdXRwdXRzLFxuICAgICAgICBjb21tYW5kczogcHJvcHMudGVzdENvbW1hbmRzLmNhbGwodGhpcywgYWNjb3VudCwgY3VzdG9tU3RhZ2UuY2ZuT3V0cHV0cyksXG4gICAgICAgIHJ1bk9yZGVyOiBwcmVwcm9kU3RhZ2UubmV4dFNlcXVlbnRpYWxSdW5PcmRlcigpLFxuICAgICAgfSksIC4uLihwcm9wcy5kZXN0cm95U3RhY2s/LmNhbGwodGhpcywgYWNjb3VudCkgPyBbbmV3IENsb3VkRm9ybWF0aW9uRGVsZXRlU3RhY2tBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnRGVzdHJveVN0YWNrJyxcbiAgICAgICAgc3RhY2tOYW1lOiBgJHtwcm9wcy5yZXBvc2l0b3J5TmFtZX0tJHthY2NvdW50LnN0YWdlfWAsXG4gICAgICAgIGFkbWluUGVybWlzc2lvbnM6IHRydWUsXG4gICAgICAgIHJ1bk9yZGVyOiBwcmVwcm9kU3RhZ2UubmV4dFNlcXVlbnRpYWxSdW5PcmRlcigpXG4gICAgICB9KV0gOiBbXSkpO1xuICAgIH1cbiAgfVxufVxuIl19