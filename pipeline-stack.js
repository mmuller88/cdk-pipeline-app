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
            // const useValueOutputs2: Record<string, CfnOutput> = {};
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
            // const useOutputs: Record<string, StackOutput> = {};
            const useValueOutputs = {};
            // tslint:disable-next-line: forin
            for (const cfnOutput in customStage.cfnOutputs) {
                // useOutputs[cfnOutput] = cdkPipeline.stackOutput(customStage.cfnOutputs[cfnOutput]);
                useValueOutputs[cfnOutput] = customStage.cfnOutputs[cfnOutput];
                // useOutputs[cfnOutput]
            }
            const testStage = cdkPipeline.addStage(`TestCustomStack-${account.stage}`);
            testStage.addActions(new pipelines_1.ShellScriptAction({
                additionalArtifacts: [sourceArtifact],
                actionName: 'TestCustomStack',
                // useOutputs,
                // commands: [],
                commands: props.testCommands.call(this, account, customStage.stringOutputs),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBK0Q7QUFDL0QsZ0ZBQXdHO0FBQ3hHLHdDQUFnRztBQUNoRyxrREFBdUY7QUFDdkYsd0VBQW1FO0FBQ25FLGlEQUE4QztBQUM5QyxpREFBNkM7QUFpQjdDLE1BQWEsYUFBYyxTQUFRLFlBQUs7SUFDdEMsWUFBWSxHQUFRLEVBQUUsRUFBVSxFQUFFLEtBQXlCOztRQUN6RCxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QixXQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sS0FBSyxHQUFHLGtCQUFXLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtZQUNqRCxTQUFTLEVBQUUsdUJBQXVCO1NBQ25DLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUkscUNBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM1RCxTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxjQUFjLEVBQUUsWUFBWTtZQUM1Qix3QkFBd0IsRUFBRSxJQUFJO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksMkJBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7UUFFN0MsTUFBTSxXQUFXLEdBQUcsSUFBSSx1QkFBVyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdkQsb0JBQW9CO1lBQ3BCLDhDQUE4QztZQUM5QyxxQkFBcUI7WUFDckIsWUFBWSxF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YWN0LCBQaXBlbGluZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgQ2xvdWRGb3JtYXRpb25EZWxldGVTdGFja0FjdGlvbiwgR2l0SHViU291cmNlQWN0aW9uIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMsIFNlY3JldFZhbHVlLCBUYWdzLCBDb25zdHJ1Y3QsIENmbk91dHB1dCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2RrUGlwZWxpbmUsIFNoZWxsU2NyaXB0QWN0aW9uLCBTaW1wbGVTeW50aEFjdGlvbiB9IGZyb20gXCJAYXdzLWNkay9waXBlbGluZXNcIjtcbmltcG9ydCB7IEF1dG9EZWxldGVCdWNrZXQgfSBmcm9tICdAbW9iaWxlcG9zc2UvYXV0by1kZWxldGUtYnVja2V0JztcbmltcG9ydCB7IGRlcGVuZGVuY2llcyB9IGZyb20gJy4vcGFja2FnZS5qc29uJztcbmltcG9ydCB7IEN1c3RvbVN0YWdlIH0gZnJvbSAnLi9jdXN0b20tc3RhZ2UnO1xuaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gJy4vYWNjb3VudENvbmZpZyc7XG5pbXBvcnQgeyBDdXN0b21TdGFjayB9IGZyb20gJy4vY3VzdG9tLXN0YWNrJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIFBpcGVsaW5lU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICAvLyBjdXN0b21TdGFnZTogU3RhZ2U7XG4gIGN1c3RvbVN0YWNrOiAoc2NvcGU6IENvbnN0cnVjdCwgYWNjb3VudDogQWNjb3VudCkgPT4gQ3VzdG9tU3RhY2s7XG4gIC8vIGN1c3RvbVN0YWNrOiBDdXN0b21TdGFjaztcbiAgYWNjb3VudHM6IEFjY291bnRbXTtcbiAgYnJhbmNoOiBzdHJpbmc7XG4gIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIGRlc3Ryb3lTdGFjaz86IChhY2NvdW50OiBBY2NvdW50KSA9PiBib29sZWFuO1xuICBtYW51YWxBcHByb3ZhbHM/OiAoYWNjb3VudDogQWNjb3VudCkgPT4gYm9vbGVhbjtcbiAgdGVzdENvbW1hbmRzOiAoYWNjb3VudDogQWNjb3VudCwgY2ZuT3V0cHV0czogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gc3RyaW5nW107XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IFBpcGVsaW5lU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKGFwcCwgaWQsIHByb3BzKTtcblxuICAgIFRhZ3Mub2YodGhpcykuYWRkKCdQaXBlbGluZVN0YWNrJywgdGhpcy5zdGFja05hbWUpO1xuXG4gICAgY29uc3Qgb2F1dGggPSBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignYWxmY2RrJywge1xuICAgICAganNvbkZpZWxkOiAnbXVsbGVyODgtZ2l0aHViLXRva2VuJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBBdXRvRGVsZXRlQnVja2V0KHRoaXMsICdQaXBlQnVja2V0Jywge1xuICAgICAgdmVyc2lvbmVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgYXJ0aWZhY3RCdWNrZXQ6IHNvdXJjZUJ1Y2tldCxcbiAgICAgIHJlc3RhcnRFeGVjdXRpb25PblVwZGF0ZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNvdXJjZUFydGlmYWN0ID0gbmV3IEFydGlmYWN0KCk7XG4gICAgY29uc3QgY2xvdWRBc3NlbWJseUFydGlmYWN0ID0gbmV3IEFydGlmYWN0KCk7XG5cbiAgICBjb25zdCBjZGtQaXBlbGluZSA9IG5ldyBDZGtQaXBlbGluZSh0aGlzLCAnQ2RrUGlwZWxpbmUnLCB7XG4gICAgICAvLyBUaGUgcGlwZWxpbmUgbmFtZVxuICAgICAgLy8gcGlwZWxpbmVOYW1lOiBgJHt0aGlzLnN0YWNrTmFtZX0tcGlwZWxpbmVgLFxuICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuICAgICAgY29kZVBpcGVsaW5lOiBwaXBlbGluZSxcblxuICAgICAgLy8gV2hlcmUgdGhlIHNvdXJjZSBjYW4gYmUgZm91bmRcbiAgICAgIHNvdXJjZUFjdGlvbjogbmV3IEdpdEh1YlNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdHaXRodWJTb3VyY2UnLFxuICAgICAgICBicmFuY2g6IHByb3BzLmJyYW5jaCxcbiAgICAgICAgb3duZXI6ICdtbXVsbGVyODgnLFxuICAgICAgICByZXBvOiBwcm9wcy5yZXBvc2l0b3J5TmFtZSxcbiAgICAgICAgb2F1dGhUb2tlbjogb2F1dGgsXG4gICAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICB9KSxcblxuICAgICAgLy8gSG93IGl0IHdpbGwgYmUgYnVpbHQgYW5kIHN5bnRoZXNpemVkXG4gICAgICBzeW50aEFjdGlvbjogU2ltcGxlU3ludGhBY3Rpb24uc3RhbmRhcmROcG1TeW50aCh7XG4gICAgICAgIHNvdXJjZUFydGlmYWN0LFxuICAgICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICAgIGluc3RhbGxDb21tYW5kOiBgbnBtIGluc3RhbGwgLWcgYXdzLWNka0Ake2RlcGVuZGVuY2llc1snQGF3cy1jZGsvY29yZSddfWAsXG4gICAgICAgIHN5bnRoQ29tbWFuZDogJ21ha2UgY2Rrc3ludGhwcm9kJyxcbiAgICAgICAgLy8gc3ViZGlyZWN0b3J5OiAnY2RrJyxcbiAgICAgICAgLy8gV2UgbmVlZCBhIGJ1aWxkIHN0ZXAgdG8gY29tcGlsZSB0aGUgVHlwZVNjcmlwdCBMYW1iZGFcbiAgICAgICAgLy8gYnVpbGRDb21tYW5kOiAnbWFrZSBidWlsZCAmJiBtYWtlIGNka2J1aWxkJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gdG9kbzogYWRkIGRldkFjY291bnQgbGF0ZXJcbiAgICBmb3IgKGNvbnN0IGFjY291bnQgb2YgcHJvcHMuYWNjb3VudHMpIHtcblxuICAgICAgLy8gY29uc3QgdXNlVmFsdWVPdXRwdXRzMjogUmVjb3JkPHN0cmluZywgQ2ZuT3V0cHV0PiA9IHt9O1xuXG4gICAgICBjb25zdCBjdXN0b21TdGFnZSA9IG5ldyBDdXN0b21TdGFnZSh0aGlzLCBgQ3VzdG9tU3RhZ2UtJHthY2NvdW50LnN0YWdlfWAsIHtcbiAgICAgICAgY3VzdG9tU3RhY2s6IHByb3BzLmN1c3RvbVN0YWNrLFxuICAgICAgICAvLyBjdXN0b21TdGFjazogKF9zY29wZSwgYWNjb3VudCkgPT4ge1xuICAgICAgICAvLyAgIHJldHVybiBwcm9wcy5jdXN0b21TdGFjayh0aGlzLCBhY2NvdW50KTtcbiAgICAgICAgLy8gfSxcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogYWNjb3VudC5pZCxcbiAgICAgICAgICByZWdpb246IGFjY291bnQucmVnaW9uLFxuICAgICAgICB9XG4gICAgICB9LCBhY2NvdW50KTtcblxuICAgICAgLy8gY29uc29sZS5sb2coJ2N1c3RvbVN0YWdlID0gJyArIGN1c3RvbVN0YWdlKTtcblxuICAgICAgY29uc3QgcHJlcHJvZFN0YWdlID0gY2RrUGlwZWxpbmUuYWRkQXBwbGljYXRpb25TdGFnZShjdXN0b21TdGFnZSwgeyBtYW51YWxBcHByb3ZhbHM6IHByb3BzLm1hbnVhbEFwcHJvdmFscz8uY2FsbCh0aGlzLCBhY2NvdW50KSB9KTtcblxuICAgICAgLy8gY29uc3QgdXNlT3V0cHV0czogUmVjb3JkPHN0cmluZywgU3RhY2tPdXRwdXQ+ID0ge307XG4gICAgICBjb25zdCB1c2VWYWx1ZU91dHB1dHM6IFJlY29yZDxzdHJpbmcsIENmbk91dHB1dD4gPSB7fTtcblxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBmb3JpblxuICAgICAgZm9yKGNvbnN0IGNmbk91dHB1dCBpbiBjdXN0b21TdGFnZS5jZm5PdXRwdXRzKXtcbiAgICAgICAgLy8gdXNlT3V0cHV0c1tjZm5PdXRwdXRdID0gY2RrUGlwZWxpbmUuc3RhY2tPdXRwdXQoY3VzdG9tU3RhZ2UuY2ZuT3V0cHV0c1tjZm5PdXRwdXRdKTtcbiAgICAgICAgdXNlVmFsdWVPdXRwdXRzW2Nmbk91dHB1dF0gPSBjdXN0b21TdGFnZS5jZm5PdXRwdXRzW2Nmbk91dHB1dF07XG4gICAgICAgIC8vIHVzZU91dHB1dHNbY2ZuT3V0cHV0XVxuICAgICAgfVxuXG4gICAgICBjb25zdCB0ZXN0U3RhZ2UgPSBjZGtQaXBlbGluZS5hZGRTdGFnZShgVGVzdEN1c3RvbVN0YWNrLSR7YWNjb3VudC5zdGFnZX1gKTtcbiAgICAgIHRlc3RTdGFnZS5hZGRBY3Rpb25zKG5ldyBTaGVsbFNjcmlwdEFjdGlvbih7XG4gICAgICAgIGFkZGl0aW9uYWxBcnRpZmFjdHM6IFtzb3VyY2VBcnRpZmFjdF0sXG4gICAgICAgIGFjdGlvbk5hbWU6ICdUZXN0Q3VzdG9tU3RhY2snLFxuICAgICAgICAvLyB1c2VPdXRwdXRzLFxuICAgICAgICAvLyBjb21tYW5kczogW10sXG4gICAgICAgIGNvbW1hbmRzOiBwcm9wcy50ZXN0Q29tbWFuZHMuY2FsbCh0aGlzLCBhY2NvdW50LCBjdXN0b21TdGFnZS5zdHJpbmdPdXRwdXRzKSxcbiAgICAgICAgLy8gY29tbWFuZHM6IHByb3BzLnRlc3RDb21tYW5kcy5jYWxsKHRoaXMsIGFjY291bnQsIGN1c3RvbVN0YWdlLmNmbk91dHB1dHMpLFxuICAgICAgICBydW5PcmRlcjogcHJlcHJvZFN0YWdlLm5leHRTZXF1ZW50aWFsUnVuT3JkZXIoKSxcbiAgICAgIH0pLCAuLi4ocHJvcHMuZGVzdHJveVN0YWNrPy5jYWxsKHRoaXMsIGFjY291bnQpID8gW25ldyBDbG91ZEZvcm1hdGlvbkRlbGV0ZVN0YWNrQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0Rlc3Ryb3lTdGFjaycsXG4gICAgICAgIHN0YWNrTmFtZTogYCR7cHJvcHMucmVwb3NpdG9yeU5hbWV9LSR7YWNjb3VudC5zdGFnZX1gLFxuICAgICAgICBhZG1pblBlcm1pc3Npb25zOiB0cnVlLFxuICAgICAgICBydW5PcmRlcjogcHJlcHJvZFN0YWdlLm5leHRTZXF1ZW50aWFsUnVuT3JkZXIoKVxuICAgICAgfSldIDogW10pKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==