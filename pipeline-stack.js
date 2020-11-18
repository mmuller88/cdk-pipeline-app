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
const aws_iam_1 = require("@aws-cdk/aws-iam");
class PipelineStack extends core_1.Stack {
    constructor(app, id, props) {
        var _a;
        super(app, id, props);
        core_1.Tags.of(this).add("PipelineStack", this.stackName);
        // const oauth = SecretValue.secretsManager('alfcdk', {
        //   jsonField: 'muller88-github-token',
        // });
        const sourceBucket = new auto_delete_bucket_1.AutoDeleteBucket(this, "PipeBucket", {
            versioned: true,
        });
        const pipeline = new aws_codepipeline_1.Pipeline(this, "Pipeline", {
            artifactBucket: sourceBucket,
            restartExecutionOnUpdate: true,
        });
        const sourceArtifact = new aws_codepipeline_1.Artifact();
        const cloudAssemblyArtifact = new aws_codepipeline_1.Artifact();
        const cdkPipeline = new pipelines_1.CdkPipeline(this, "CdkPipeline", {
            // The pipeline name
            // pipelineName: `${this.stackName}-pipeline`,
            cloudAssemblyArtifact,
            codePipeline: pipeline,
            // Where the source can be found
            sourceAction: new aws_codepipeline_actions_1.GitHubSourceAction({
                actionName: "GithubSource",
                branch: props.branch,
                owner: props.gitHub.owner,
                repo: props.repositoryName,
                oauthToken: props.gitHub.oauthToken,
                output: sourceArtifact,
            }),
            // How it will be built and synthesized
            synthAction: pipelines_1.SimpleSynthAction.standardNpmSynth({
                sourceArtifact,
                cloudAssemblyArtifact,
                installCommand: `yarn install && yarn global add aws-cdk@${package_json_1.dependencies["@aws-cdk/core"]}`,
                synthCommand: `yarn run cdksynth`,
                // subdirectory: 'cdk',
                // We need a build step to compile the TypeScript Lambda
                buildCommand: props.buildCommand,
            }),
        });
        // todo: add devAccount later
        for (const stageAccount of props.stageAccounts) {
            // const useValueOutputs2: Record<string, CfnOutput> = {};
            const customStage = new custom_stage_1.CustomStage(this, `CustomStage-${stageAccount.stage}`, {
                customStack: props.customStack,
                // customStack: (_scope, account) => {
                //   return props.customStack(this, account);
                // },
                env: {
                    account: stageAccount.account.id,
                    region: stageAccount.account.region,
                },
            }, stageAccount);
            // console.log('customStage = ' + customStage);
            const preprodStage = cdkPipeline.addApplicationStage(customStage, {
                manualApprovals: (_a = props.manualApprovals) === null || _a === void 0 ? void 0 : _a.call(this, stageAccount),
            });
            const useOutputs = {};
            // tslint:disable-next-line: forin
            for (const cfnOutput in customStage.cfnOutputs) {
                useOutputs[cfnOutput] = cdkPipeline.stackOutput(customStage.cfnOutputs[cfnOutput]);
            }
            const testCommands = props.testCommands.call(this, stageAccount);
            preprodStage.addActions(new pipelines_1.ShellScriptAction({
                rolePolicyStatements: [
                    new aws_iam_1.PolicyStatement({
                        actions: ["*"],
                        resources: ["*"],
                    }),
                ],
                additionalArtifacts: [sourceArtifact],
                actionName: "TestCustomStack",
                useOutputs,
                commands: testCommands,
                runOrder: preprodStage.nextSequentialRunOrder(),
            }));
        }
    }
}
exports.PipelineStack = PipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBK0Q7QUFDL0QsZ0ZBQXVFO0FBQ3ZFLHdDQU91QjtBQUN2QixrREFLNEI7QUFDNUIsd0VBQW1FO0FBQ25FLGlEQUE4QztBQUM5QyxpREFBNkM7QUFHN0MsOENBQW1EO0FBZW5ELE1BQWEsYUFBYyxTQUFRLFlBQUs7SUFDdEMsWUFBWSxHQUFRLEVBQUUsRUFBVSxFQUFFLEtBQXlCOztRQUN6RCxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QixXQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELHVEQUF1RDtRQUN2RCx3Q0FBd0M7UUFDeEMsTUFBTTtRQUVOLE1BQU0sWUFBWSxHQUFHLElBQUkscUNBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM1RCxTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxjQUFjLEVBQUUsWUFBWTtZQUM1Qix3QkFBd0IsRUFBRSxJQUFJO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksMkJBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7UUFFN0MsTUFBTSxXQUFXLEdBQUcsSUFBSSx1QkFBVyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdkQsb0JBQW9CO1lBQ3BCLDhDQUE4QztZQUM5QyxxQkFBcUI7WUFDckIsWUFBWSxFQUFFLFFBQVE7WUFFdEIsZ0NBQWdDO1lBQ2hDLFlBQVksRUFBRSxJQUFJLDZDQUFrQixDQUFDO2dCQUNuQyxVQUFVLEVBQUUsY0FBYztnQkFDMUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO2dCQUNwQixLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO2dCQUN6QixJQUFJLEVBQUUsS0FBSyxDQUFDLGNBQWM7Z0JBQzFCLFVBQVUsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVU7Z0JBQ25DLE1BQU0sRUFBRSxjQUFjO2FBQ3ZCLENBQUM7WUFFRix1Q0FBdUM7WUFDdkMsV0FBVyxFQUFFLDZCQUFpQixDQUFDLGdCQUFnQixDQUFDO2dCQUM5QyxjQUFjO2dCQUNkLHFCQUFxQjtnQkFDckIsY0FBYyxFQUFFLDJDQUEyQywyQkFBWSxDQUFDLGVBQWUsQ0FBQyxFQUFFO2dCQUMxRixZQUFZLEVBQUUsbUJBQW1CO2dCQUNqQyx1QkFBdUI7Z0JBQ3ZCLHdEQUF3RDtnQkFDeEQsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO2FBQ2pDLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCw2QkFBNkI7UUFDN0IsS0FBSyxNQUFNLFlBQVksSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQzlDLDBEQUEwRDtZQUUxRCxNQUFNLFdBQVcsR0FBRyxJQUFJLDBCQUFXLENBQ2pDLElBQUksRUFDSixlQUFlLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFDbkM7Z0JBQ0UsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM5QixzQ0FBc0M7Z0JBQ3RDLDZDQUE2QztnQkFDN0MsS0FBSztnQkFDTCxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDaEMsTUFBTSxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTTtpQkFDcEM7YUFDRixFQUNELFlBQVksQ0FDYixDQUFDO1lBRUYsK0NBQStDO1lBRS9DLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUU7Z0JBQ2hFLGVBQWUsUUFBRSxLQUFLLENBQUMsZUFBZSwwQ0FBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQzthQUNqRSxDQUFDLENBQUM7WUFFSCxNQUFNLFVBQVUsR0FBZ0MsRUFBRSxDQUFDO1lBRW5ELGtDQUFrQztZQUNsQyxLQUFLLE1BQU0sU0FBUyxJQUFJLFdBQVcsQ0FBQyxVQUFVLEVBQUU7Z0JBQzlDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUM3QyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUNsQyxDQUFDO2FBQ0g7WUFFRCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFakUsWUFBWSxDQUFDLFVBQVUsQ0FDckIsSUFBSSw2QkFBaUIsQ0FBQztnQkFDcEIsb0JBQW9CLEVBQUU7b0JBQ3BCLElBQUkseUJBQWUsQ0FBQzt3QkFDbEIsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO3dCQUNkLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztxQkFDakIsQ0FBQztpQkFDSDtnQkFDRCxtQkFBbUIsRUFBRSxDQUFDLGNBQWMsQ0FBQztnQkFDckMsVUFBVSxFQUFFLGlCQUFpQjtnQkFDN0IsVUFBVTtnQkFDVixRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFLFlBQVksQ0FBQyxzQkFBc0IsRUFBRTthQUNoRCxDQUFDLENBQ0gsQ0FBQztTQUNIO0lBQ0gsQ0FBQztDQUNGO0FBeEdELHNDQXdHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFydGlmYWN0LCBQaXBlbGluZSB9IGZyb20gXCJAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lXCI7XG5pbXBvcnQgeyBHaXRIdWJTb3VyY2VBY3Rpb24gfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zXCI7XG5pbXBvcnQge1xuICBBcHAsXG4gIFN0YWNrLFxuICBTdGFja1Byb3BzLFxuICBTZWNyZXRWYWx1ZSxcbiAgVGFncyxcbiAgQ29uc3RydWN0LFxufSBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0IHtcbiAgQ2RrUGlwZWxpbmUsXG4gIFNoZWxsU2NyaXB0QWN0aW9uLFxuICBTaW1wbGVTeW50aEFjdGlvbixcbiAgU3RhY2tPdXRwdXQsXG59IGZyb20gXCJAYXdzLWNkay9waXBlbGluZXNcIjtcbmltcG9ydCB7IEF1dG9EZWxldGVCdWNrZXQgfSBmcm9tIFwiQG1vYmlsZXBvc3NlL2F1dG8tZGVsZXRlLWJ1Y2tldFwiO1xuaW1wb3J0IHsgZGVwZW5kZW5jaWVzIH0gZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XG5pbXBvcnQgeyBDdXN0b21TdGFnZSB9IGZyb20gXCIuL2N1c3RvbS1zdGFnZVwiO1xuaW1wb3J0IHsgU3RhZ2VBY2NvdW50IH0gZnJvbSBcIi4vYWNjb3VudENvbmZpZ1wiO1xuaW1wb3J0IHsgQ3VzdG9tU3RhY2sgfSBmcm9tIFwiLi9jdXN0b20tc3RhY2tcIjtcbmltcG9ydCB7IFBvbGljeVN0YXRlbWVudCB9IGZyb20gXCJAYXdzLWNkay9hd3MtaWFtXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVTdGFja1Byb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7XG4gIC8vIGN1c3RvbVN0YWdlOiBTdGFnZTtcbiAgY3VzdG9tU3RhY2s6IChzY29wZTogQ29uc3RydWN0LCBzdGFnZUFjY291bnQ6IFN0YWdlQWNjb3VudCkgPT4gQ3VzdG9tU3RhY2s7XG4gIC8vIGN1c3RvbVN0YWNrOiBDdXN0b21TdGFjaztcbiAgc3RhZ2VBY2NvdW50czogU3RhZ2VBY2NvdW50W107XG4gIGJyYW5jaDogc3RyaW5nO1xuICByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuICBidWlsZENvbW1hbmQ/OiBzdHJpbmc7XG4gIGdpdEh1YjogeyBvd25lcjogc3RyaW5nOyBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZSB9O1xuICBtYW51YWxBcHByb3ZhbHM/OiAoc3RhZ2VBY2NvdW50OiBTdGFnZUFjY291bnQpID0+IGJvb2xlYW47XG4gIHRlc3RDb21tYW5kczogKHN0YWdlQWNjb3VudDogU3RhZ2VBY2NvdW50KSA9PiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBpZDogc3RyaW5nLCBwcm9wczogUGlwZWxpbmVTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoYXBwLCBpZCwgcHJvcHMpO1xuXG4gICAgVGFncy5vZih0aGlzKS5hZGQoXCJQaXBlbGluZVN0YWNrXCIsIHRoaXMuc3RhY2tOYW1lKTtcblxuICAgIC8vIGNvbnN0IG9hdXRoID0gU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2FsZmNkaycsIHtcbiAgICAvLyAgIGpzb25GaWVsZDogJ211bGxlcjg4LWdpdGh1Yi10b2tlbicsXG4gICAgLy8gfSk7XG5cbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgQXV0b0RlbGV0ZUJ1Y2tldCh0aGlzLCBcIlBpcGVCdWNrZXRcIiwge1xuICAgICAgdmVyc2lvbmVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUodGhpcywgXCJQaXBlbGluZVwiLCB7XG4gICAgICBhcnRpZmFjdEJ1Y2tldDogc291cmNlQnVja2V0LFxuICAgICAgcmVzdGFydEV4ZWN1dGlvbk9uVXBkYXRlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QgPSBuZXcgQXJ0aWZhY3QoKTtcblxuICAgIGNvbnN0IGNka1BpcGVsaW5lID0gbmV3IENka1BpcGVsaW5lKHRoaXMsIFwiQ2RrUGlwZWxpbmVcIiwge1xuICAgICAgLy8gVGhlIHBpcGVsaW5lIG5hbWVcbiAgICAgIC8vIHBpcGVsaW5lTmFtZTogYCR7dGhpcy5zdGFja05hbWV9LXBpcGVsaW5lYCxcbiAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgIGNvZGVQaXBlbGluZTogcGlwZWxpbmUsXG5cbiAgICAgIC8vIFdoZXJlIHRoZSBzb3VyY2UgY2FuIGJlIGZvdW5kXG4gICAgICBzb3VyY2VBY3Rpb246IG5ldyBHaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiBcIkdpdGh1YlNvdXJjZVwiLFxuICAgICAgICBicmFuY2g6IHByb3BzLmJyYW5jaCxcbiAgICAgICAgb3duZXI6IHByb3BzLmdpdEh1Yi5vd25lcixcbiAgICAgICAgcmVwbzogcHJvcHMucmVwb3NpdG9yeU5hbWUsXG4gICAgICAgIG9hdXRoVG9rZW46IHByb3BzLmdpdEh1Yi5vYXV0aFRva2VuLFxuICAgICAgICBvdXRwdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgfSksXG5cbiAgICAgIC8vIEhvdyBpdCB3aWxsIGJlIGJ1aWx0IGFuZCBzeW50aGVzaXplZFxuICAgICAgc3ludGhBY3Rpb246IFNpbXBsZVN5bnRoQWN0aW9uLnN0YW5kYXJkTnBtU3ludGgoe1xuICAgICAgICBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuICAgICAgICBpbnN0YWxsQ29tbWFuZDogYHlhcm4gaW5zdGFsbCAmJiB5YXJuIGdsb2JhbCBhZGQgYXdzLWNka0Ake2RlcGVuZGVuY2llc1tcIkBhd3MtY2RrL2NvcmVcIl19YCxcbiAgICAgICAgc3ludGhDb21tYW5kOiBgeWFybiBydW4gY2Rrc3ludGhgLFxuICAgICAgICAvLyBzdWJkaXJlY3Rvcnk6ICdjZGsnLFxuICAgICAgICAvLyBXZSBuZWVkIGEgYnVpbGQgc3RlcCB0byBjb21waWxlIHRoZSBUeXBlU2NyaXB0IExhbWJkYVxuICAgICAgICBidWlsZENvbW1hbmQ6IHByb3BzLmJ1aWxkQ29tbWFuZCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gdG9kbzogYWRkIGRldkFjY291bnQgbGF0ZXJcbiAgICBmb3IgKGNvbnN0IHN0YWdlQWNjb3VudCBvZiBwcm9wcy5zdGFnZUFjY291bnRzKSB7XG4gICAgICAvLyBjb25zdCB1c2VWYWx1ZU91dHB1dHMyOiBSZWNvcmQ8c3RyaW5nLCBDZm5PdXRwdXQ+ID0ge307XG5cbiAgICAgIGNvbnN0IGN1c3RvbVN0YWdlID0gbmV3IEN1c3RvbVN0YWdlKFxuICAgICAgICB0aGlzLFxuICAgICAgICBgQ3VzdG9tU3RhZ2UtJHtzdGFnZUFjY291bnQuc3RhZ2V9YCxcbiAgICAgICAge1xuICAgICAgICAgIGN1c3RvbVN0YWNrOiBwcm9wcy5jdXN0b21TdGFjayxcbiAgICAgICAgICAvLyBjdXN0b21TdGFjazogKF9zY29wZSwgYWNjb3VudCkgPT4ge1xuICAgICAgICAgIC8vICAgcmV0dXJuIHByb3BzLmN1c3RvbVN0YWNrKHRoaXMsIGFjY291bnQpO1xuICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgZW52OiB7XG4gICAgICAgICAgICBhY2NvdW50OiBzdGFnZUFjY291bnQuYWNjb3VudC5pZCxcbiAgICAgICAgICAgIHJlZ2lvbjogc3RhZ2VBY2NvdW50LmFjY291bnQucmVnaW9uLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHN0YWdlQWNjb3VudFxuICAgICAgKTtcblxuICAgICAgLy8gY29uc29sZS5sb2coJ2N1c3RvbVN0YWdlID0gJyArIGN1c3RvbVN0YWdlKTtcblxuICAgICAgY29uc3QgcHJlcHJvZFN0YWdlID0gY2RrUGlwZWxpbmUuYWRkQXBwbGljYXRpb25TdGFnZShjdXN0b21TdGFnZSwge1xuICAgICAgICBtYW51YWxBcHByb3ZhbHM6IHByb3BzLm1hbnVhbEFwcHJvdmFscz8uY2FsbCh0aGlzLCBzdGFnZUFjY291bnQpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHVzZU91dHB1dHM6IFJlY29yZDxzdHJpbmcsIFN0YWNrT3V0cHV0PiA9IHt9O1xuXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGZvcmluXG4gICAgICBmb3IgKGNvbnN0IGNmbk91dHB1dCBpbiBjdXN0b21TdGFnZS5jZm5PdXRwdXRzKSB7XG4gICAgICAgIHVzZU91dHB1dHNbY2ZuT3V0cHV0XSA9IGNka1BpcGVsaW5lLnN0YWNrT3V0cHV0KFxuICAgICAgICAgIGN1c3RvbVN0YWdlLmNmbk91dHB1dHNbY2ZuT3V0cHV0XVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0ZXN0Q29tbWFuZHMgPSBwcm9wcy50ZXN0Q29tbWFuZHMuY2FsbCh0aGlzLCBzdGFnZUFjY291bnQpO1xuXG4gICAgICBwcmVwcm9kU3RhZ2UuYWRkQWN0aW9ucyhcbiAgICAgICAgbmV3IFNoZWxsU2NyaXB0QWN0aW9uKHtcbiAgICAgICAgICByb2xlUG9saWN5U3RhdGVtZW50czogW1xuICAgICAgICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICAgIGFjdGlvbnM6IFtcIipcIl0sXG4gICAgICAgICAgICAgIHJlc291cmNlczogW1wiKlwiXSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgYWRkaXRpb25hbEFydGlmYWN0czogW3NvdXJjZUFydGlmYWN0XSxcbiAgICAgICAgICBhY3Rpb25OYW1lOiBcIlRlc3RDdXN0b21TdGFja1wiLFxuICAgICAgICAgIHVzZU91dHB1dHMsXG4gICAgICAgICAgY29tbWFuZHM6IHRlc3RDb21tYW5kcyxcbiAgICAgICAgICBydW5PcmRlcjogcHJlcHJvZFN0YWdlLm5leHRTZXF1ZW50aWFsUnVuT3JkZXIoKSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=