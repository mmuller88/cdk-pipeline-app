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
            const preprodStage = cdkPipeline.addApplicationStage(customStage, { manualApprovals: true });
            let useOutputs = {};
            for (const cfnOutput in customStage.cfnOutputs) {
                useOutputs[cfnOutput] = cdkPipeline.stackOutput(customStage.cfnOutputs[cfnOutput]);
            }
            preprodStage.addActions(new pipelines_1.ShellScriptAction({
                actionName: 'TestCustomStack',
                useOutputs,
                commands: props.testCommands.call(this, account),
                runOrder: preprodStage.nextSequentialRunOrder(),
            }), new aws_codepipeline_actions_1.CloudFormationDeleteStackAction({
                actionName: 'DestroyStack',
                stackName: `${props.repositoryName}-${account.stage}`,
                adminPermissions: true,
                runOrder: preprodStage.nextSequentialRunOrder(),
            }));
        }
    }
}
exports.PipelineStack = PipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBK0Q7QUFDL0QsZ0ZBQXdHO0FBQ3hHLHdDQUFxRjtBQUNyRixrREFBb0c7QUFDcEcsd0VBQW1FO0FBQ25FLGlEQUE4QztBQUM5QyxpREFBNkM7QUFDN0MsbURBQW1FO0FBY25FLE1BQWEsYUFBYyxTQUFRLFlBQUs7SUFDdEMsWUFBWSxHQUFRLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ3pELEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXRCLFdBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFbkQsTUFBTSxLQUFLLEdBQUcsa0JBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFO1lBQ2pELFNBQVMsRUFBRSx1QkFBdUI7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxxQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzVELFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksMkJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzlDLGNBQWMsRUFBRSxZQUFZO1lBQzVCLHdCQUF3QixFQUFFLElBQUk7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7UUFDdEMsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLDJCQUFRLEVBQUUsQ0FBQztRQUU3QyxNQUFNLFdBQVcsR0FBRyxJQUFJLHVCQUFXLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUN2RCxvQkFBb0I7WUFDcEIsOENBQThDO1lBQzlDLHFCQUFxQjtZQUNyQixZQUFZLEVBQUUsUUFBUTtZQUV0QixnQ0FBZ0M7WUFDaEMsWUFBWSxFQUFFLElBQUksNkNBQWtCLENBQUM7Z0JBQ25DLFVBQVUsRUFBRSxjQUFjO2dCQUMxQixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07Z0JBQ3BCLEtBQUssRUFBRSxXQUFXO2dCQUNsQixJQUFJLEVBQUUsS0FBSyxDQUFDLGNBQWM7Z0JBQzFCLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixNQUFNLEVBQUUsY0FBYzthQUN2QixDQUFDO1lBRUYsdUNBQXVDO1lBQ3ZDLFdBQVcsRUFBRSw2QkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDOUMsY0FBYztnQkFDZCxxQkFBcUI7Z0JBQ3JCLGNBQWMsRUFBRSwwQkFBMEIsMkJBQVksQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDekUsWUFBWSxFQUFFLG1CQUFtQjthQUlsQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsNkJBQTZCO1FBQzdCLEtBQUssTUFBTSxPQUFPLElBQUksQ0FBQywwQkFBVSxFQUFFLDJCQUFXLENBQUMsRUFBRTtZQUMvQyxnREFBZ0Q7WUFDaEQsMEJBQTBCO1lBQzFCLG9DQUFvQztZQUNwQyxvQ0FBb0M7WUFDcEMsa0NBQWtDO1lBQ2xDLDJEQUEyRDtZQUMzRCx3Q0FBd0M7WUFDeEMsZ0NBQWdDO1lBQ2hDLHFDQUFxQztZQUNyQyxJQUFJO1lBQ0osbUdBQW1HO1lBRW5HLE1BQU0sV0FBVyxHQUFHLElBQUksMEJBQVcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3hFLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDOUIsc0NBQXNDO2dCQUN0Qyw2Q0FBNkM7Z0JBQzdDLEtBQUs7Z0JBQ0wsR0FBRyxFQUFFO29CQUNILE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRTtvQkFDbkIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2lCQUN2QjthQUNGLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFWiwrQ0FBK0M7WUFFL0MsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRzdGLElBQUksVUFBVSxHQUFnQyxFQUFFLENBQUM7WUFFakQsS0FBSSxNQUFNLFNBQVMsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFDO2dCQUM1QyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDcEY7WUFFRCxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksNkJBQWlCLENBQUM7Z0JBQzVDLFVBQVUsRUFBRSxpQkFBaUI7Z0JBQzdCLFVBQVU7Z0JBQ1YsUUFBUSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7Z0JBQ2hELFFBQVEsRUFBRSxZQUFZLENBQUMsc0JBQXNCLEVBQUU7YUFDaEQsQ0FBQyxFQUFFLElBQUksMERBQStCLENBQUM7Z0JBQ3RDLFVBQVUsRUFBRSxjQUFjO2dCQUMxQixTQUFTLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JELGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLFFBQVEsRUFBRSxZQUFZLENBQUMsc0JBQXNCLEVBQUU7YUFDaEQsQ0FBQyxDQUFDLENBQUM7U0FDTDtJQUNILENBQUM7Q0FDRjtBQW5HRCxzQ0FtR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcnRpZmFjdCwgUGlwZWxpbmUgfSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCB7IENsb3VkRm9ybWF0aW9uRGVsZXRlU3RhY2tBY3Rpb24sIEdpdEh1YlNvdXJjZUFjdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBTZWNyZXRWYWx1ZSwgVGFncywgQ29uc3RydWN0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDZGtQaXBlbGluZSwgU2hlbGxTY3JpcHRBY3Rpb24sIFNpbXBsZVN5bnRoQWN0aW9uLCBTdGFja091dHB1dCB9IGZyb20gXCJAYXdzLWNkay9waXBlbGluZXNcIjtcbmltcG9ydCB7IEF1dG9EZWxldGVCdWNrZXQgfSBmcm9tICdAbW9iaWxlcG9zc2UvYXV0by1kZWxldGUtYnVja2V0JztcbmltcG9ydCB7IGRlcGVuZGVuY2llcyB9IGZyb20gJy4vcGFja2FnZS5qc29uJztcbmltcG9ydCB7IEN1c3RvbVN0YWdlIH0gZnJvbSAnLi9jdXN0b20tc3RhZ2UnO1xuaW1wb3J0IHsgQWNjb3VudCwgZGV2QWNjb3VudCwgcHJvZEFjY291bnQgfSBmcm9tICcuL2FjY291bnRDb25maWcnO1xuaW1wb3J0IHsgQ3VzdG9tU3RhY2sgfSBmcm9tICcuL2N1c3RvbS1zdGFjayc7XG5cblxuXG5leHBvcnQgaW50ZXJmYWNlIFBpcGVsaW5lU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICAvLyBjdXN0b21TdGFnZTogU3RhZ2U7XG4gIGN1c3RvbVN0YWNrOiAoc2NvcGU6IENvbnN0cnVjdCwgYWNjb3VudDogQWNjb3VudCkgPT4gQ3VzdG9tU3RhY2s7XG4gIC8vIGN1c3RvbVN0YWNrOiBDdXN0b21TdGFjaztcbiAgYnJhbmNoOiBzdHJpbmc7XG4gIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIHRlc3RDb21tYW5kczogKGFjY291bnQ6IEFjY291bnQpID0+IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzOiBQaXBlbGluZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihhcHAsIGlkLCBwcm9wcyk7XG5cbiAgICBUYWdzLm9mKHRoaXMpLmFkZCgnUGlwZWxpbmVTdGFjaycsIHRoaXMuc3RhY2tOYW1lKTtcblxuICAgIGNvbnN0IG9hdXRoID0gU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2FsZmNkaycsIHtcbiAgICAgIGpzb25GaWVsZDogJ211bGxlcjg4LWdpdGh1Yi10b2tlbicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgQXV0b0RlbGV0ZUJ1Y2tldCh0aGlzLCAnUGlwZUJ1Y2tldCcsIHtcbiAgICAgIHZlcnNpb25lZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IFBpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIGFydGlmYWN0QnVja2V0OiBzb3VyY2VCdWNrZXQsXG4gICAgICByZXN0YXJ0RXhlY3V0aW9uT25VcGRhdGU6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3VyY2VBcnRpZmFjdCA9IG5ldyBBcnRpZmFjdCgpO1xuICAgIGNvbnN0IGNsb3VkQXNzZW1ibHlBcnRpZmFjdCA9IG5ldyBBcnRpZmFjdCgpO1xuXG4gICAgY29uc3QgY2RrUGlwZWxpbmUgPSBuZXcgQ2RrUGlwZWxpbmUodGhpcywgJ0Nka1BpcGVsaW5lJywge1xuICAgICAgLy8gVGhlIHBpcGVsaW5lIG5hbWVcbiAgICAgIC8vIHBpcGVsaW5lTmFtZTogYCR7dGhpcy5zdGFja05hbWV9LXBpcGVsaW5lYCxcbiAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgIGNvZGVQaXBlbGluZTogcGlwZWxpbmUsXG5cbiAgICAgIC8vIFdoZXJlIHRoZSBzb3VyY2UgY2FuIGJlIGZvdW5kXG4gICAgICBzb3VyY2VBY3Rpb246IG5ldyBHaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnR2l0aHViU291cmNlJyxcbiAgICAgICAgYnJhbmNoOiBwcm9wcy5icmFuY2gsXG4gICAgICAgIG93bmVyOiAnbW11bGxlcjg4JyxcbiAgICAgICAgcmVwbzogcHJvcHMucmVwb3NpdG9yeU5hbWUsXG4gICAgICAgIG9hdXRoVG9rZW46IG9hdXRoLFxuICAgICAgICBvdXRwdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgfSksXG5cbiAgICAgIC8vIEhvdyBpdCB3aWxsIGJlIGJ1aWx0IGFuZCBzeW50aGVzaXplZFxuICAgICAgc3ludGhBY3Rpb246IFNpbXBsZVN5bnRoQWN0aW9uLnN0YW5kYXJkTnBtU3ludGgoe1xuICAgICAgICBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuICAgICAgICBpbnN0YWxsQ29tbWFuZDogYG5wbSBpbnN0YWxsIC1nIGF3cy1jZGtAJHtkZXBlbmRlbmNpZXNbJ0Bhd3MtY2RrL2NvcmUnXX1gLFxuICAgICAgICBzeW50aENvbW1hbmQ6ICdtYWtlIGNka3N5bnRocHJvZCcsXG4gICAgICAgIC8vIHN1YmRpcmVjdG9yeTogJ2NkaycsXG4gICAgICAgIC8vIFdlIG5lZWQgYSBidWlsZCBzdGVwIHRvIGNvbXBpbGUgdGhlIFR5cGVTY3JpcHQgTGFtYmRhXG4gICAgICAgIC8vIGJ1aWxkQ29tbWFuZDogJ21ha2UgYnVpbGQgJiYgbWFrZSBjZGtidWlsZCcsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIHRvZG86IGFkZCBkZXZBY2NvdW50IGxhdGVyXG4gICAgZm9yIChjb25zdCBhY2NvdW50IG9mIFtkZXZBY2NvdW50LCBwcm9kQWNjb3VudF0pIHtcbiAgICAgIC8vIGNvbnN0IGN1c3RvbVN0YWNrUHJvcHMgOiBDdXN0b21TdGFja1Byb3BzID0ge1xuICAgICAgLy8gICBzdGFnZTogYWNjb3VudC5zdGFnZSxcbiAgICAgIC8vICAgZG9tYWluTmFtZTogYWNjb3VudC5kb21haW5OYW1lLFxuICAgICAgLy8gICBhY21DZXJ0UmVmOiBhY2NvdW50LmFjbUNlcnRSZWYsXG4gICAgICAvLyAgIHN1YkRvbWFpbjogYWNjb3VudC5zdWJEb21haW4sXG4gICAgICAvLyAgIHN0YWNrTmFtZTogYCR7cHJvcHMucmVwb3NpdG9yeU5hbWV9LSR7YWNjb3VudC5zdGFnZX1gLFxuICAgICAgLy8gICBob3N0ZWRab25lSWQ6IGFjY291bnQuaG9zdGVkWm9uZUlkLFxuICAgICAgLy8gICB6b25lTmFtZTogYWNjb3VudC56b25lTmFtZSxcbiAgICAgIC8vICAgLy8gc3ViRG9tYWluOiBhY2NvdW50LnN1YkRvbWFpbixcbiAgICAgIC8vIH1cbiAgICAgIC8vIGNvbnNvbGUuaW5mbyhgJHthY2NvdW50LnN0YWdlfSBDdXN0b21TdGFja1Byb3BzOiAke0pTT04uc3RyaW5naWZ5KGN1c3RvbVN0YWNrUHJvcHMsIG51bGwsIDIpfWApO1xuXG4gICAgICBjb25zdCBjdXN0b21TdGFnZSA9IG5ldyBDdXN0b21TdGFnZSh0aGlzLCBgQ3VzdG9tU3RhZ2UtJHthY2NvdW50LnN0YWdlfWAsIHtcbiAgICAgICAgY3VzdG9tU3RhY2s6IHByb3BzLmN1c3RvbVN0YWNrLFxuICAgICAgICAvLyBjdXN0b21TdGFjazogKF9zY29wZSwgYWNjb3VudCkgPT4ge1xuICAgICAgICAvLyAgIHJldHVybiBwcm9wcy5jdXN0b21TdGFjayh0aGlzLCBhY2NvdW50KTtcbiAgICAgICAgLy8gfSxcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogYWNjb3VudC5pZCxcbiAgICAgICAgICByZWdpb246IGFjY291bnQucmVnaW9uLFxuICAgICAgICB9XG4gICAgICB9LCBhY2NvdW50KTtcblxuICAgICAgLy8gY29uc29sZS5sb2coJ2N1c3RvbVN0YWdlID0gJyArIGN1c3RvbVN0YWdlKTtcblxuICAgICAgY29uc3QgcHJlcHJvZFN0YWdlID0gY2RrUGlwZWxpbmUuYWRkQXBwbGljYXRpb25TdGFnZShjdXN0b21TdGFnZSwgeyBtYW51YWxBcHByb3ZhbHM6IHRydWUgfSk7XG5cbiAgICAgIFxuICAgICAgbGV0IHVzZU91dHB1dHM6IFJlY29yZDxzdHJpbmcsIFN0YWNrT3V0cHV0PiA9IHt9O1xuXG4gICAgICBmb3IoY29uc3QgY2ZuT3V0cHV0IGluIGN1c3RvbVN0YWdlLmNmbk91dHB1dHMpe1xuICAgICAgICB1c2VPdXRwdXRzW2Nmbk91dHB1dF0gPSBjZGtQaXBlbGluZS5zdGFja091dHB1dChjdXN0b21TdGFnZS5jZm5PdXRwdXRzW2Nmbk91dHB1dF0pO1xuICAgICAgfVxuXG4gICAgICBwcmVwcm9kU3RhZ2UuYWRkQWN0aW9ucyhuZXcgU2hlbGxTY3JpcHRBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnVGVzdEN1c3RvbVN0YWNrJyxcbiAgICAgICAgdXNlT3V0cHV0cyxcbiAgICAgICAgY29tbWFuZHM6IHByb3BzLnRlc3RDb21tYW5kcy5jYWxsKHRoaXMsIGFjY291bnQpLFxuICAgICAgICBydW5PcmRlcjogcHJlcHJvZFN0YWdlLm5leHRTZXF1ZW50aWFsUnVuT3JkZXIoKSxcbiAgICAgIH0pLCBuZXcgQ2xvdWRGb3JtYXRpb25EZWxldGVTdGFja0FjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdEZXN0cm95U3RhY2snLFxuICAgICAgICBzdGFja05hbWU6IGAke3Byb3BzLnJlcG9zaXRvcnlOYW1lfS0ke2FjY291bnQuc3RhZ2V9YCxcbiAgICAgICAgYWRtaW5QZXJtaXNzaW9uczogdHJ1ZSxcbiAgICAgICAgcnVuT3JkZXI6IHByZXByb2RTdGFnZS5uZXh0U2VxdWVudGlhbFJ1bk9yZGVyKCksXG4gICAgICB9KSk7XG4gICAgfVxuICB9XG59XG4iXX0=