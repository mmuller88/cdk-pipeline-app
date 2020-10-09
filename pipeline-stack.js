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
            const preprodStage = cdkPipeline.addApplicationStage(customStage, { manualApprovals: ((_a = props.manualApprovals) === null || _a === void 0 ? void 0 : _a.call(this, account)) || true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBK0Q7QUFDL0QsZ0ZBQXdHO0FBQ3hHLHdDQUFxRjtBQUNyRixrREFBb0c7QUFDcEcsd0VBQW1FO0FBQ25FLGlEQUE4QztBQUM5QyxpREFBNkM7QUFDN0MsbURBQW1FO0FBZ0JuRSxNQUFhLGFBQWMsU0FBUSxZQUFLO0lBQ3RDLFlBQVksR0FBUSxFQUFFLEVBQVUsRUFBRSxLQUF5Qjs7UUFDekQsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdEIsV0FBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVuRCxNQUFNLEtBQUssR0FBRyxrQkFBVyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUU7WUFDakQsU0FBUyxFQUFFLHVCQUF1QjtTQUNuQyxDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLHFDQUFnQixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDNUQsU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSwyQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsY0FBYyxFQUFFLFlBQVk7WUFDNUIsd0JBQXdCLEVBQUUsSUFBSTtTQUMvQixDQUFDLENBQUM7UUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLDJCQUFRLEVBQUUsQ0FBQztRQUN0QyxNQUFNLHFCQUFxQixHQUFHLElBQUksMkJBQVEsRUFBRSxDQUFDO1FBRTdDLE1BQU0sV0FBVyxHQUFHLElBQUksdUJBQVcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3ZELG9CQUFvQjtZQUNwQiw4Q0FBOEM7WUFDOUMscUJBQXFC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fSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCB7IENsb3VkRm9ybWF0aW9uRGVsZXRlU3RhY2tBY3Rpb24sIEdpdEh1YlNvdXJjZUFjdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBTZWNyZXRWYWx1ZSwgVGFncywgQ29uc3RydWN0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDZGtQaXBlbGluZSwgU2hlbGxTY3JpcHRBY3Rpb24sIFNpbXBsZVN5bnRoQWN0aW9uLCBTdGFja091dHB1dCB9IGZyb20gXCJAYXdzLWNkay9waXBlbGluZXNcIjtcbmltcG9ydCB7IEF1dG9EZWxldGVCdWNrZXQgfSBmcm9tICdAbW9iaWxlcG9zc2UvYXV0by1kZWxldGUtYnVja2V0JztcbmltcG9ydCB7IGRlcGVuZGVuY2llcyB9IGZyb20gJy4vcGFja2FnZS5qc29uJztcbmltcG9ydCB7IEN1c3RvbVN0YWdlIH0gZnJvbSAnLi9jdXN0b20tc3RhZ2UnO1xuaW1wb3J0IHsgQWNjb3VudCwgZGV2QWNjb3VudCwgcHJvZEFjY291bnQgfSBmcm9tICcuL2FjY291bnRDb25maWcnO1xuaW1wb3J0IHsgQ3VzdG9tU3RhY2sgfSBmcm9tICcuL2N1c3RvbS1zdGFjayc7XG5cblxuXG5leHBvcnQgaW50ZXJmYWNlIFBpcGVsaW5lU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICAvLyBjdXN0b21TdGFnZTogU3RhZ2U7XG4gIGN1c3RvbVN0YWNrOiAoc2NvcGU6IENvbnN0cnVjdCwgYWNjb3VudDogQWNjb3VudCkgPT4gQ3VzdG9tU3RhY2s7XG4gIC8vIGN1c3RvbVN0YWNrOiBDdXN0b21TdGFjaztcbiAgYnJhbmNoOiBzdHJpbmc7XG4gIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIGRlc3Ryb3lTdGFjaz86IChhY2NvdW50OiBBY2NvdW50KSA9PiBib29sZWFuO1xuICBtYW51YWxBcHByb3ZhbHM/OiAoYWNjb3VudDogQWNjb3VudCkgPT4gYm9vbGVhbjtcbiAgdGVzdENvbW1hbmRzOiAoYWNjb3VudDogQWNjb3VudCkgPT4gc3RyaW5nW107XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IFBpcGVsaW5lU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKGFwcCwgaWQsIHByb3BzKTtcblxuICAgIFRhZ3Mub2YodGhpcykuYWRkKCdQaXBlbGluZVN0YWNrJywgdGhpcy5zdGFja05hbWUpO1xuXG4gICAgY29uc3Qgb2F1dGggPSBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignYWxmY2RrJywge1xuICAgICAganNvbkZpZWxkOiAnbXVsbGVyODgtZ2l0aHViLXRva2VuJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBBdXRvRGVsZXRlQnVja2V0KHRoaXMsICdQaXBlQnVja2V0Jywge1xuICAgICAgdmVyc2lvbmVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgYXJ0aWZhY3RCdWNrZXQ6IHNvdXJjZUJ1Y2tldCxcbiAgICAgIHJlc3RhcnRFeGVjdXRpb25PblVwZGF0ZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNvdXJjZUFydGlmYWN0ID0gbmV3IEFydGlmYWN0KCk7XG4gICAgY29uc3QgY2xvdWRBc3NlbWJseUFydGlmYWN0ID0gbmV3IEFydGlmYWN0KCk7XG5cbiAgICBjb25zdCBjZGtQaXBlbGluZSA9IG5ldyBDZGtQaXBlbGluZSh0aGlzLCAnQ2RrUGlwZWxpbmUnLCB7XG4gICAgICAvLyBUaGUgcGlwZWxpbmUgbmFtZVxuICAgICAgLy8gcGlwZWxpbmVOYW1lOiBgJHt0aGlzLnN0YWNrTmFtZX0tcGlwZWxpbmVgLFxuICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuICAgICAgY29kZVBpcGVsaW5lOiBwaXBlbGluZSxcblxuICAgICAgLy8gV2hlcmUgdGhlIHNvdXJjZSBjYW4gYmUgZm91bmRcbiAgICAgIHNvdXJjZUFjdGlvbjogbmV3IEdpdEh1YlNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdHaXRodWJTb3VyY2UnLFxuICAgICAgICBicmFuY2g6IHByb3BzLmJyYW5jaCxcbiAgICAgICAgb3duZXI6ICdtbXVsbGVyODgnLFxuICAgICAgICByZXBvOiBwcm9wcy5yZXBvc2l0b3J5TmFtZSxcbiAgICAgICAgb2F1dGhUb2tlbjogb2F1dGgsXG4gICAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICB9KSxcblxuICAgICAgLy8gSG93IGl0IHdpbGwgYmUgYnVpbHQgYW5kIHN5bnRoZXNpemVkXG4gICAgICBzeW50aEFjdGlvbjogU2ltcGxlU3ludGhBY3Rpb24uc3RhbmRhcmROcG1TeW50aCh7XG4gICAgICAgIHNvdXJjZUFydGlmYWN0LFxuICAgICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICAgIGluc3RhbGxDb21tYW5kOiBgbnBtIGluc3RhbGwgLWcgYXdzLWNka0Ake2RlcGVuZGVuY2llc1snQGF3cy1jZGsvY29yZSddfWAsXG4gICAgICAgIHN5bnRoQ29tbWFuZDogJ21ha2UgY2Rrc3ludGhwcm9kJyxcbiAgICAgICAgLy8gc3ViZGlyZWN0b3J5OiAnY2RrJyxcbiAgICAgICAgLy8gV2UgbmVlZCBhIGJ1aWxkIHN0ZXAgdG8gY29tcGlsZSB0aGUgVHlwZVNjcmlwdCBMYW1iZGFcbiAgICAgICAgLy8gYnVpbGRDb21tYW5kOiAnbWFrZSBidWlsZCAmJiBtYWtlIGNka2J1aWxkJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gdG9kbzogYWRkIGRldkFjY291bnQgbGF0ZXJcbiAgICBmb3IgKGNvbnN0IGFjY291bnQgb2YgW2RldkFjY291bnQsIHByb2RBY2NvdW50XSkge1xuICAgICAgLy8gY29uc3QgY3VzdG9tU3RhY2tQcm9wcyA6IEN1c3RvbVN0YWNrUHJvcHMgPSB7XG4gICAgICAvLyAgIHN0YWdlOiBhY2NvdW50LnN0YWdlLFxuICAgICAgLy8gICBkb21haW5OYW1lOiBhY2NvdW50LmRvbWFpbk5hbWUsXG4gICAgICAvLyAgIGFjbUNlcnRSZWY6IGFjY291bnQuYWNtQ2VydFJlZixcbiAgICAgIC8vICAgc3ViRG9tYWluOiBhY2NvdW50LnN1YkRvbWFpbixcbiAgICAgIC8vICAgc3RhY2tOYW1lOiBgJHtwcm9wcy5yZXBvc2l0b3J5TmFtZX0tJHthY2NvdW50LnN0YWdlfWAsXG4gICAgICAvLyAgIGhvc3RlZFpvbmVJZDogYWNjb3VudC5ob3N0ZWRab25lSWQsXG4gICAgICAvLyAgIHpvbmVOYW1lOiBhY2NvdW50LnpvbmVOYW1lLFxuICAgICAgLy8gICAvLyBzdWJEb21haW46IGFjY291bnQuc3ViRG9tYWluLFxuICAgICAgLy8gfVxuICAgICAgLy8gY29uc29sZS5pbmZvKGAke2FjY291bnQuc3RhZ2V9IEN1c3RvbVN0YWNrUHJvcHM6ICR7SlNPTi5zdHJpbmdpZnkoY3VzdG9tU3RhY2tQcm9wcywgbnVsbCwgMil9YCk7XG5cbiAgICAgIGNvbnN0IGN1c3RvbVN0YWdlID0gbmV3IEN1c3RvbVN0YWdlKHRoaXMsIGBDdXN0b21TdGFnZS0ke2FjY291bnQuc3RhZ2V9YCwge1xuICAgICAgICBjdXN0b21TdGFjazogcHJvcHMuY3VzdG9tU3RhY2ssXG4gICAgICAgIC8vIGN1c3RvbVN0YWNrOiAoX3Njb3BlLCBhY2NvdW50KSA9PiB7XG4gICAgICAgIC8vICAgcmV0dXJuIHByb3BzLmN1c3RvbVN0YWNrKHRoaXMsIGFjY291bnQpO1xuICAgICAgICAvLyB9LFxuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiBhY2NvdW50LmlkLFxuICAgICAgICAgIHJlZ2lvbjogYWNjb3VudC5yZWdpb24sXG4gICAgICAgIH1cbiAgICAgIH0sIGFjY291bnQpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnY3VzdG9tU3RhZ2UgPSAnICsgY3VzdG9tU3RhZ2UpO1xuXG4gICAgICBjb25zdCBwcmVwcm9kU3RhZ2UgPSBjZGtQaXBlbGluZS5hZGRBcHBsaWNhdGlvblN0YWdlKGN1c3RvbVN0YWdlLCB7IG1hbnVhbEFwcHJvdmFsczogcHJvcHMubWFudWFsQXBwcm92YWxzPy5jYWxsKHRoaXMsIGFjY291bnQpIHx8IHRydWUgfSk7XG5cbiAgICAgIGNvbnN0IHVzZU91dHB1dHM6IFJlY29yZDxzdHJpbmcsIFN0YWNrT3V0cHV0PiA9IHt9O1xuXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGZvcmluXG4gICAgICBmb3IoY29uc3QgY2ZuT3V0cHV0IGluIGN1c3RvbVN0YWdlLmNmbk91dHB1dHMpe1xuICAgICAgICB1c2VPdXRwdXRzW2Nmbk91dHB1dF0gPSBjZGtQaXBlbGluZS5zdGFja091dHB1dChjdXN0b21TdGFnZS5jZm5PdXRwdXRzW2Nmbk91dHB1dF0pO1xuICAgICAgfVxuXG4gICAgICBwcmVwcm9kU3RhZ2UuYWRkQWN0aW9ucyhuZXcgU2hlbGxTY3JpcHRBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnVGVzdEN1c3RvbVN0YWNrJyxcbiAgICAgICAgdXNlT3V0cHV0cyxcbiAgICAgICAgY29tbWFuZHM6IHByb3BzLnRlc3RDb21tYW5kcy5jYWxsKHRoaXMsIGFjY291bnQpLFxuICAgICAgICBydW5PcmRlcjogcHJlcHJvZFN0YWdlLm5leHRTZXF1ZW50aWFsUnVuT3JkZXIoKSxcbiAgICAgIH0pLCAuLi4ocHJvcHMuZGVzdHJveVN0YWNrPy5jYWxsKHRoaXMsIGFjY291bnQpID8gW25ldyBDbG91ZEZvcm1hdGlvbkRlbGV0ZVN0YWNrQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0Rlc3Ryb3lTdGFjaycsXG4gICAgICAgIHN0YWNrTmFtZTogYCR7cHJvcHMucmVwb3NpdG9yeU5hbWV9LSR7YWNjb3VudC5zdGFnZX1gLFxuICAgICAgICBhZG1pblBlcm1pc3Npb25zOiB0cnVlLFxuICAgICAgICBydW5PcmRlcjogcHJlcHJvZFN0YWdlLm5leHRTZXF1ZW50aWFsUnVuT3JkZXIoKVxuICAgICAgfSldIDogW10pKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==