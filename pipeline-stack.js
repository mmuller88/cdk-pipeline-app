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
const accountConfig_1 = require("./accountConfig");
class PipelineStack extends core_1.Stack {
    constructor(app, id, props) {
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
        for (const account of [accountConfig_1.devAccount, accountConfig_1.prodAccount]) {
            // const customStackProps : CustomStackProps = {
            //   stage: account.stage,
            //   domainName: account.domainName,
            //   acmCertRef: account.acmCertRef,
            //   subDomain: account.subDomain,
            //   stackName: `${props.repositoryName}-${account.stage}`,
            //   hostedZoneId: account.hostedZoneId,
            //   zoneName: account.zoneName,
            //   // subDomain: account.subDomain,
            // }
            // console.info(`${account.stage} CustomStackProps: ${JSON.stringify(customStackProps, null, 2)}`);
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
            const preprodStage = cdkPipeline.addApplicationStage(customStage, { manualApprovals: props.manualApprovals === undefined ? true : props.manualApprovals });
            const useOutputs = {};
            // tslint:disable-next-line: forin
            for (const cfnOutput in customStage.cfnOutputs) {
                useOutputs[cfnOutput] = cdkPipeline.stackOutput(customStage.cfnOutputs[cfnOutput]);
            }
            preprodStage.addActions(new pipelines_1.ShellScriptAction({
                actionName: 'TestCustomStack',
                useOutputs,
                commands: props.testCommands.call(this, account),
                runOrder: preprodStage.nextSequentialRunOrder(),
            }), ...(props.destroyStack ? [new aws_codepipeline_actions_1.CloudFormationDeleteStackAction({
                    actionName: 'DestroyStack',
                    stackName: `${props.repositoryName}-${account.stage}`,
                    adminPermissions: true,
                    runOrder: preprodStage.nextSequentialRunOrder()
                })] : []));
        }
    }
}
exports.PipelineStack = PipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBK0Q7QUFDL0QsZ0ZBQXdHO0FBQ3hHLHdDQUFxRjtBQUNyRixrREFBb0c7QUFDcEcsd0VBQW1FO0FBQ25FLGlEQUE4QztBQUM5QyxpREFBNkM7QUFDN0MsbURBQW1FO0FBZ0JuRSxNQUFhLGFBQWMsU0FBUSxZQUFLO0lBQ3RDLFlBQVksR0FBUSxFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUN6RCxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QixXQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sS0FBSyxHQUFHLGtCQUFXLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtZQUNqRCxTQUFTLEVBQUUsdUJBQXVCO1NBQ25DLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUkscUNBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM1RCxTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxjQUFjLEVBQUUsWUFBWTtZQUM1Qix3QkFBd0IsRUFBRSxJQUFJO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksMkJBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7UUFFN0MsTUFBTSxXQUFXLEdBQUcsSUFBSSx1QkFBVyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdkQsb0JBQW9CO1lBQ3BCLDhDQUE4QztZQUM5QyxxQkFBcUI7WUFDckIsWUFBWSxFQUFFLFFBQVE7WUFFdEIsZ0NBQWdDO1lBQ2hDLFlBQVksRUFBRSxJQUFJLDZDQUFrQixDQUFDO2dCQUNuQyxVQUFVLEVBQUUsY0FBYztnQkFDMUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO2dCQUNwQixLQUFLLEVBQUUsV0FBVztnQkFDbEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxjQUFjO2dCQUMxQixVQUFVLEVBQUUsS0FBSztnQkFDakIsTUFBTSxFQUFFLGNBQWM7YUFDdkIsQ0FBQztZQUVGLHVDQUF1QztZQUN2QyxXQUFXLEVBQUUsNkJBQWlCLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzlDLGNBQWM7Z0JBQ2QscUJBQXFCO2dCQUNyQixjQUFjLEVBQUUsMEJBQTBCLDJCQUFZLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ3pFLFlBQVksRUFBRSxtQkFBbUI7YUFJbEMsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILDZCQUE2QjtRQUM3QixLQUFLLE1BQU0sT0FBTyxJQUFJLENBQUMsMEJBQVUsRUFBRSwyQkFBVyxDQUFDLEVBQUU7WUFDL0MsZ0RBQWdEO1lBQ2hELDBCQUEwQjtZQUMxQixvQ0FBb0M7WUFDcEMsb0NBQW9DO1lBQ3BDLGtDQUFrQztZQUNsQywyREFBMkQ7WUFDM0Qsd0NBQXdDO1lBQ3hDLGdDQUFnQztZQUNoQyxxQ0FBcUM7WUFDckMsSUFBSTtZQUNKLG1HQUFtRztZQUVuRyxNQUFNLFdBQVcsR0FBRyxJQUFJLDBCQUFXLENBQUMsSUFBSSxFQUFFLGVBQWUsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUN4RSxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQzlCLHNDQUFzQztnQkFDdEMsNkNBQTZDO2dCQUM3QyxLQUFLO2dCQUNMLEdBQUcsRUFBRTtvQkFDSCxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUU7b0JBQ25CLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtpQkFDdkI7YUFDRixFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRVosK0NBQStDO1lBRS9DLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFFM0osTUFBTSxVQUFVLEdBQWdDLEVBQUUsQ0FBQztZQUVuRCxrQ0FBa0M7WUFDbEMsS0FBSSxNQUFNLFNBQVMsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFDO2dCQUM1QyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDcEY7WUFFRCxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksNkJBQWlCLENBQUM7Z0JBQzVDLFVBQVUsRUFBRSxpQkFBaUI7Z0JBQzdCLFVBQVU7Z0JBQ1YsUUFBUSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7Z0JBQ2hELFFBQVEsRUFBRSxZQUFZLENBQUMsc0JBQXNCLEVBQUU7YUFDaEQsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksMERBQStCLENBQUM7b0JBQ2hFLFVBQVUsRUFBRSxjQUFjO29CQUMxQixTQUFTLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7b0JBQ3JELGdCQUFnQixFQUFFLElBQUk7b0JBQ3RCLFFBQVEsRUFBRSxZQUFZLENBQUMsc0JBQXNCLEVBQUU7aUJBQ2hELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ1o7SUFDSCxDQUFDO0NBQ0Y7QUFuR0Qsc0NBbUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJ0aWZhY3QsIFBpcGVsaW5lIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgeyBDbG91ZEZvcm1hdGlvbkRlbGV0ZVN0YWNrQWN0aW9uLCBHaXRIdWJTb3VyY2VBY3Rpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcywgU2VjcmV0VmFsdWUsIFRhZ3MsIENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2RrUGlwZWxpbmUsIFNoZWxsU2NyaXB0QWN0aW9uLCBTaW1wbGVTeW50aEFjdGlvbiwgU3RhY2tPdXRwdXQgfSBmcm9tIFwiQGF3cy1jZGsvcGlwZWxpbmVzXCI7XG5pbXBvcnQgeyBBdXRvRGVsZXRlQnVja2V0IH0gZnJvbSAnQG1vYmlsZXBvc3NlL2F1dG8tZGVsZXRlLWJ1Y2tldCc7XG5pbXBvcnQgeyBkZXBlbmRlbmNpZXMgfSBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBDdXN0b21TdGFnZSB9IGZyb20gJy4vY3VzdG9tLXN0YWdlJztcbmltcG9ydCB7IEFjY291bnQsIGRldkFjY291bnQsIHByb2RBY2NvdW50IH0gZnJvbSAnLi9hY2NvdW50Q29uZmlnJztcbmltcG9ydCB7IEN1c3RvbVN0YWNrIH0gZnJvbSAnLi9jdXN0b20tc3RhY2snO1xuXG5cblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgLy8gY3VzdG9tU3RhZ2U6IFN0YWdlO1xuICBjdXN0b21TdGFjazogKHNjb3BlOiBDb25zdHJ1Y3QsIGFjY291bnQ6IEFjY291bnQpID0+IEN1c3RvbVN0YWNrO1xuICAvLyBjdXN0b21TdGFjazogQ3VzdG9tU3RhY2s7XG4gIGJyYW5jaDogc3RyaW5nO1xuICByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuICBkZXN0cm95U3RhY2s/OiBib29sZWFuO1xuICBtYW51YWxBcHByb3ZhbHM/OiBib29sZWFuO1xuICB0ZXN0Q29tbWFuZHM6IChhY2NvdW50OiBBY2NvdW50KSA9PiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBpZDogc3RyaW5nLCBwcm9wczogUGlwZWxpbmVTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoYXBwLCBpZCwgcHJvcHMpO1xuXG4gICAgVGFncy5vZih0aGlzKS5hZGQoJ1BpcGVsaW5lU3RhY2snLCB0aGlzLnN0YWNrTmFtZSk7XG5cbiAgICBjb25zdCBvYXV0aCA9IFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCdhbGZjZGsnLCB7XG4gICAgICBqc29uRmllbGQ6ICdtdWxsZXI4OC1naXRodWItdG9rZW4nLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IEF1dG9EZWxldGVCdWNrZXQodGhpcywgJ1BpcGVCdWNrZXQnLCB7XG4gICAgICB2ZXJzaW9uZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBhcnRpZmFjdEJ1Y2tldDogc291cmNlQnVja2V0LFxuICAgICAgcmVzdGFydEV4ZWN1dGlvbk9uVXBkYXRlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QgPSBuZXcgQXJ0aWZhY3QoKTtcblxuICAgIGNvbnN0IGNka1BpcGVsaW5lID0gbmV3IENka1BpcGVsaW5lKHRoaXMsICdDZGtQaXBlbGluZScsIHtcbiAgICAgIC8vIFRoZSBwaXBlbGluZSBuYW1lXG4gICAgICAvLyBwaXBlbGluZU5hbWU6IGAke3RoaXMuc3RhY2tOYW1lfS1waXBlbGluZWAsXG4gICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICBjb2RlUGlwZWxpbmU6IHBpcGVsaW5lLFxuXG4gICAgICAvLyBXaGVyZSB0aGUgc291cmNlIGNhbiBiZSBmb3VuZFxuICAgICAgc291cmNlQWN0aW9uOiBuZXcgR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0dpdGh1YlNvdXJjZScsXG4gICAgICAgIGJyYW5jaDogcHJvcHMuYnJhbmNoLFxuICAgICAgICBvd25lcjogJ21tdWxsZXI4OCcsXG4gICAgICAgIHJlcG86IHByb3BzLnJlcG9zaXRvcnlOYW1lLFxuICAgICAgICBvYXV0aFRva2VuOiBvYXV0aCxcbiAgICAgICAgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgIH0pLFxuXG4gICAgICAvLyBIb3cgaXQgd2lsbCBiZSBidWlsdCBhbmQgc3ludGhlc2l6ZWRcbiAgICAgIHN5bnRoQWN0aW9uOiBTaW1wbGVTeW50aEFjdGlvbi5zdGFuZGFyZE5wbVN5bnRoKHtcbiAgICAgICAgc291cmNlQXJ0aWZhY3QsXG4gICAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgICAgaW5zdGFsbENvbW1hbmQ6IGBucG0gaW5zdGFsbCAtZyBhd3MtY2RrQCR7ZGVwZW5kZW5jaWVzWydAYXdzLWNkay9jb3JlJ119YCxcbiAgICAgICAgc3ludGhDb21tYW5kOiAnbWFrZSBjZGtzeW50aHByb2QnLFxuICAgICAgICAvLyBzdWJkaXJlY3Rvcnk6ICdjZGsnLFxuICAgICAgICAvLyBXZSBuZWVkIGEgYnVpbGQgc3RlcCB0byBjb21waWxlIHRoZSBUeXBlU2NyaXB0IExhbWJkYVxuICAgICAgICAvLyBidWlsZENvbW1hbmQ6ICdtYWtlIGJ1aWxkICYmIG1ha2UgY2RrYnVpbGQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyB0b2RvOiBhZGQgZGV2QWNjb3VudCBsYXRlclxuICAgIGZvciAoY29uc3QgYWNjb3VudCBvZiBbZGV2QWNjb3VudCwgcHJvZEFjY291bnRdKSB7XG4gICAgICAvLyBjb25zdCBjdXN0b21TdGFja1Byb3BzIDogQ3VzdG9tU3RhY2tQcm9wcyA9IHtcbiAgICAgIC8vICAgc3RhZ2U6IGFjY291bnQuc3RhZ2UsXG4gICAgICAvLyAgIGRvbWFpbk5hbWU6IGFjY291bnQuZG9tYWluTmFtZSxcbiAgICAgIC8vICAgYWNtQ2VydFJlZjogYWNjb3VudC5hY21DZXJ0UmVmLFxuICAgICAgLy8gICBzdWJEb21haW46IGFjY291bnQuc3ViRG9tYWluLFxuICAgICAgLy8gICBzdGFja05hbWU6IGAke3Byb3BzLnJlcG9zaXRvcnlOYW1lfS0ke2FjY291bnQuc3RhZ2V9YCxcbiAgICAgIC8vICAgaG9zdGVkWm9uZUlkOiBhY2NvdW50Lmhvc3RlZFpvbmVJZCxcbiAgICAgIC8vICAgem9uZU5hbWU6IGFjY291bnQuem9uZU5hbWUsXG4gICAgICAvLyAgIC8vIHN1YkRvbWFpbjogYWNjb3VudC5zdWJEb21haW4sXG4gICAgICAvLyB9XG4gICAgICAvLyBjb25zb2xlLmluZm8oYCR7YWNjb3VudC5zdGFnZX0gQ3VzdG9tU3RhY2tQcm9wczogJHtKU09OLnN0cmluZ2lmeShjdXN0b21TdGFja1Byb3BzLCBudWxsLCAyKX1gKTtcblxuICAgICAgY29uc3QgY3VzdG9tU3RhZ2UgPSBuZXcgQ3VzdG9tU3RhZ2UodGhpcywgYEN1c3RvbVN0YWdlLSR7YWNjb3VudC5zdGFnZX1gLCB7XG4gICAgICAgIGN1c3RvbVN0YWNrOiBwcm9wcy5jdXN0b21TdGFjayxcbiAgICAgICAgLy8gY3VzdG9tU3RhY2s6IChfc2NvcGUsIGFjY291bnQpID0+IHtcbiAgICAgICAgLy8gICByZXR1cm4gcHJvcHMuY3VzdG9tU3RhY2sodGhpcywgYWNjb3VudCk7XG4gICAgICAgIC8vIH0sXG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6IGFjY291bnQuaWQsXG4gICAgICAgICAgcmVnaW9uOiBhY2NvdW50LnJlZ2lvbixcbiAgICAgICAgfVxuICAgICAgfSwgYWNjb3VudCk7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjdXN0b21TdGFnZSA9ICcgKyBjdXN0b21TdGFnZSk7XG5cbiAgICAgIGNvbnN0IHByZXByb2RTdGFnZSA9IGNka1BpcGVsaW5lLmFkZEFwcGxpY2F0aW9uU3RhZ2UoY3VzdG9tU3RhZ2UsIHsgbWFudWFsQXBwcm92YWxzOiBwcm9wcy5tYW51YWxBcHByb3ZhbHMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBwcm9wcy5tYW51YWxBcHByb3ZhbHMgfSk7XG5cbiAgICAgIGNvbnN0IHVzZU91dHB1dHM6IFJlY29yZDxzdHJpbmcsIFN0YWNrT3V0cHV0PiA9IHt9O1xuXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGZvcmluXG4gICAgICBmb3IoY29uc3QgY2ZuT3V0cHV0IGluIGN1c3RvbVN0YWdlLmNmbk91dHB1dHMpe1xuICAgICAgICB1c2VPdXRwdXRzW2Nmbk91dHB1dF0gPSBjZGtQaXBlbGluZS5zdGFja091dHB1dChjdXN0b21TdGFnZS5jZm5PdXRwdXRzW2Nmbk91dHB1dF0pO1xuICAgICAgfVxuXG4gICAgICBwcmVwcm9kU3RhZ2UuYWRkQWN0aW9ucyhuZXcgU2hlbGxTY3JpcHRBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnVGVzdEN1c3RvbVN0YWNrJyxcbiAgICAgICAgdXNlT3V0cHV0cyxcbiAgICAgICAgY29tbWFuZHM6IHByb3BzLnRlc3RDb21tYW5kcy5jYWxsKHRoaXMsIGFjY291bnQpLFxuICAgICAgICBydW5PcmRlcjogcHJlcHJvZFN0YWdlLm5leHRTZXF1ZW50aWFsUnVuT3JkZXIoKSxcbiAgICAgIH0pLCAuLi4ocHJvcHMuZGVzdHJveVN0YWNrID8gW25ldyBDbG91ZEZvcm1hdGlvbkRlbGV0ZVN0YWNrQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0Rlc3Ryb3lTdGFjaycsXG4gICAgICAgIHN0YWNrTmFtZTogYCR7cHJvcHMucmVwb3NpdG9yeU5hbWV9LSR7YWNjb3VudC5zdGFnZX1gLFxuICAgICAgICBhZG1pblBlcm1pc3Npb25zOiB0cnVlLFxuICAgICAgICBydW5PcmRlcjogcHJlcHJvZFN0YWdlLm5leHRTZXF1ZW50aWFsUnVuT3JkZXIoKVxuICAgICAgfSldIDogW10pKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==