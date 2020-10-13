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
            const useOutputs = {};
            // tslint:disable-next-line: forin
            for (const cfnOutput in customStage.cfnOutputs) {
                useOutputs[cfnOutput] = cdkPipeline.stackOutput(customStage.cfnOutputs[cfnOutput]);
            }
            const testCommands = props.testCommands.call(this, account);
            preprodStage.addActions(new pipelines_1.ShellScriptAction({
                rolePolicyStatements: [new aws_iam_1.PolicyStatement({
                        actions: ['*'],
                        resources: ['*'],
                    })],
                additionalArtifacts: [sourceArtifact],
                actionName: 'TestCustomStack',
                useOutputs,
                commands: testCommands,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBK0Q7QUFDL0QsZ0ZBQXdHO0FBQ3hHLHdDQUFxRjtBQUNyRixrREFBb0c7QUFDcEcsd0VBQW1FO0FBQ25FLGlEQUE4QztBQUM5QyxpREFBNkM7QUFHN0MsOENBQW1EO0FBZW5ELE1BQWEsYUFBYyxTQUFRLFlBQUs7SUFDdEMsWUFBWSxHQUFRLEVBQUUsRUFBVSxFQUFFLEtBQXlCOztRQUN6RCxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QixXQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sS0FBSyxHQUFHLGtCQUFXLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtZQUNqRCxTQUFTLEVBQUUsdUJBQXVCO1NBQ25DLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUkscUNBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM1RCxTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxjQUFjLEVBQUUsWUFBWTtZQUM1Qix3QkFBd0IsRUFBRSxJQUFJO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksMkJBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7UUFFN0MsTUFBTSxXQUFXLEdBQUcsSUFBSSx1QkFBVyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdkQsb0JBQW9CO1lBQ3BCLDhDQUE4QztZQUM5QyxxQkFBcUI7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bnQiOlsiaW1wb3J0IHsgQXJ0aWZhY3QsIFBpcGVsaW5lIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgeyBDbG91ZEZvcm1hdGlvbkRlbGV0ZVN0YWNrQWN0aW9uLCBHaXRIdWJTb3VyY2VBY3Rpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcywgU2VjcmV0VmFsdWUsIFRhZ3MsIENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2RrUGlwZWxpbmUsIFNoZWxsU2NyaXB0QWN0aW9uLCBTaW1wbGVTeW50aEFjdGlvbiwgU3RhY2tPdXRwdXQgfSBmcm9tIFwiQGF3cy1jZGsvcGlwZWxpbmVzXCI7XG5pbXBvcnQgeyBBdXRvRGVsZXRlQnVja2V0IH0gZnJvbSAnQG1vYmlsZXBvc3NlL2F1dG8tZGVsZXRlLWJ1Y2tldCc7XG5pbXBvcnQgeyBkZXBlbmRlbmNpZXMgfSBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBDdXN0b21TdGFnZSB9IGZyb20gJy4vY3VzdG9tLXN0YWdlJztcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICcuL2FjY291bnRDb25maWcnO1xuaW1wb3J0IHsgQ3VzdG9tU3RhY2sgfSBmcm9tICcuL2N1c3RvbS1zdGFjayc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIFBpcGVsaW5lU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICAvLyBjdXN0b21TdGFnZTogU3RhZ2U7XG4gIGN1c3RvbVN0YWNrOiAoc2NvcGU6IENvbnN0cnVjdCwgYWNjb3VudDogQWNjb3VudCkgPT4gQ3VzdG9tU3RhY2s7XG4gIC8vIGN1c3RvbVN0YWNrOiBDdXN0b21TdGFjaztcbiAgYWNjb3VudHM6IEFjY291bnRbXTtcbiAgYnJhbmNoOiBzdHJpbmc7XG4gIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIGRlc3Ryb3lTdGFjaz86IChhY2NvdW50OiBBY2NvdW50KSA9PiBib29sZWFuO1xuICBtYW51YWxBcHByb3ZhbHM/OiAoYWNjb3VudDogQWNjb3VudCkgPT4gYm9vbGVhbjtcbiAgdGVzdENvbW1hbmRzOiAoYWNjb3VudDogQWNjb3VudCkgPT4gc3RyaW5nW107XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IFBpcGVsaW5lU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKGFwcCwgaWQsIHByb3BzKTtcblxuICAgIFRhZ3Mub2YodGhpcykuYWRkKCdQaXBlbGluZVN0YWNrJywgdGhpcy5zdGFja05hbWUpO1xuXG4gICAgY29uc3Qgb2F1dGggPSBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignYWxmY2RrJywge1xuICAgICAganNvbkZpZWxkOiAnbXVsbGVyODgtZ2l0aHViLXRva2VuJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBBdXRvRGVsZXRlQnVja2V0KHRoaXMsICdQaXBlQnVja2V0Jywge1xuICAgICAgdmVyc2lvbmVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgYXJ0aWZhY3RCdWNrZXQ6IHNvdXJjZUJ1Y2tldCxcbiAgICAgIHJlc3RhcnRFeGVjdXRpb25PblVwZGF0ZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNvdXJjZUFydGlmYWN0ID0gbmV3IEFydGlmYWN0KCk7XG4gICAgY29uc3QgY2xvdWRBc3NlbWJseUFydGlmYWN0ID0gbmV3IEFydGlmYWN0KCk7XG5cbiAgICBjb25zdCBjZGtQaXBlbGluZSA9IG5ldyBDZGtQaXBlbGluZSh0aGlzLCAnQ2RrUGlwZWxpbmUnLCB7XG4gICAgICAvLyBUaGUgcGlwZWxpbmUgbmFtZVxuICAgICAgLy8gcGlwZWxpbmVOYW1lOiBgJHt0aGlzLnN0YWNrTmFtZX0tcGlwZWxpbmVgLFxuICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuICAgICAgY29kZVBpcGVsaW5lOiBwaXBlbGluZSxcblxuICAgICAgLy8gV2hlcmUgdGhlIHNvdXJjZSBjYW4gYmUgZm91bmRcbiAgICAgIHNvdXJjZUFjdGlvbjogbmV3IEdpdEh1YlNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdHaXRodWJTb3VyY2UnLFxuICAgICAgICBicmFuY2g6IHByb3BzLmJyYW5jaCxcbiAgICAgICAgb3duZXI6ICdtbXVsbGVyODgnLFxuICAgICAgICByZXBvOiBwcm9wcy5yZXBvc2l0b3J5TmFtZSxcbiAgICAgICAgb2F1dGhUb2tlbjogb2F1dGgsXG4gICAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICB9KSxcblxuICAgICAgLy8gSG93IGl0IHdpbGwgYmUgYnVpbHQgYW5kIHN5bnRoZXNpemVkXG4gICAgICBzeW50aEFjdGlvbjogU2ltcGxlU3ludGhBY3Rpb24uc3RhbmRhcmROcG1TeW50aCh7XG4gICAgICAgIHNvdXJjZUFydGlmYWN0LFxuICAgICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICAgIGluc3RhbGxDb21tYW5kOiBgbnBtIGluc3RhbGwgLWcgYXdzLWNka0Ake2RlcGVuZGVuY2llc1snQGF3cy1jZGsvY29yZSddfWAsXG4gICAgICAgIHN5bnRoQ29tbWFuZDogJ21ha2UgY2Rrc3ludGhwcm9kJyxcbiAgICAgICAgLy8gc3ViZGlyZWN0b3J5OiAnY2RrJyxcbiAgICAgICAgLy8gV2UgbmVlZCBhIGJ1aWxkIHN0ZXAgdG8gY29tcGlsZSB0aGUgVHlwZVNjcmlwdCBMYW1iZGFcbiAgICAgICAgLy8gYnVpbGRDb21tYW5kOiAnbWFrZSBidWlsZCAmJiBtYWtlIGNka2J1aWxkJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gdG9kbzogYWRkIGRldkFjY291bnQgbGF0ZXJcbiAgICBmb3IgKGNvbnN0IGFjY291bnQgb2YgcHJvcHMuYWNjb3VudHMpIHtcblxuICAgICAgLy8gY29uc3QgdXNlVmFsdWVPdXRwdXRzMjogUmVjb3JkPHN0cmluZywgQ2ZuT3V0cHV0PiA9IHt9O1xuXG4gICAgICBjb25zdCBjdXN0b21TdGFnZSA9IG5ldyBDdXN0b21TdGFnZSh0aGlzLCBgQ3VzdG9tU3RhZ2UtJHthY2NvdW50LnN0YWdlfWAsIHtcbiAgICAgICAgY3VzdG9tU3RhY2s6IHByb3BzLmN1c3RvbVN0YWNrLFxuICAgICAgICAvLyBjdXN0b21TdGFjazogKF9zY29wZSwgYWNjb3VudCkgPT4ge1xuICAgICAgICAvLyAgIHJldHVybiBwcm9wcy5jdXN0b21TdGFjayh0aGlzLCBhY2NvdW50KTtcbiAgICAgICAgLy8gfSxcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogYWNjb3VudC5pZCxcbiAgICAgICAgICByZWdpb246IGFjY291bnQucmVnaW9uLFxuICAgICAgICB9XG4gICAgICB9LCBhY2NvdW50KTtcblxuICAgICAgLy8gY29uc29sZS5sb2coJ2N1c3RvbVN0YWdlID0gJyArIGN1c3RvbVN0YWdlKTtcblxuICAgICAgY29uc3QgcHJlcHJvZFN0YWdlID0gY2RrUGlwZWxpbmUuYWRkQXBwbGljYXRpb25TdGFnZShjdXN0b21TdGFnZSwgeyBtYW51YWxBcHByb3ZhbHM6IHByb3BzLm1hbnVhbEFwcHJvdmFscz8uY2FsbCh0aGlzLCBhY2NvdW50KSB9KTtcblxuICAgICAgY29uc3QgdXNlT3V0cHV0czogUmVjb3JkPHN0cmluZywgU3RhY2tPdXRwdXQ+ID0ge307XG5cbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZm9yaW5cbiAgICAgIGZvcihjb25zdCBjZm5PdXRwdXQgaW4gY3VzdG9tU3RhZ2UuY2ZuT3V0cHV0cyl7XG4gICAgICAgIHVzZU91dHB1dHNbY2ZuT3V0cHV0XSA9IGNka1BpcGVsaW5lLnN0YWNrT3V0cHV0KGN1c3RvbVN0YWdlLmNmbk91dHB1dHNbY2ZuT3V0cHV0XSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRlc3RDb21tYW5kcyA9IHByb3BzLnRlc3RDb21tYW5kcy5jYWxsKHRoaXMsIGFjY291bnQpO1xuXG4gICAgICBwcmVwcm9kU3RhZ2UuYWRkQWN0aW9ucyhuZXcgU2hlbGxTY3JpcHRBY3Rpb24oe1xuICAgICAgICByb2xlUG9saWN5U3RhdGVtZW50czogW25ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIH0pXSxcbiAgICAgICAgYWRkaXRpb25hbEFydGlmYWN0czogW3NvdXJjZUFydGlmYWN0XSxcbiAgICAgICAgYWN0aW9uTmFtZTogJ1Rlc3RDdXN0b21TdGFjaycsXG4gICAgICAgIHVzZU91dHB1dHMsXG4gICAgICAgIGNvbW1hbmRzOiB0ZXN0Q29tbWFuZHMsXG4gICAgICAgIHJ1bk9yZGVyOiBwcmVwcm9kU3RhZ2UubmV4dFNlcXVlbnRpYWxSdW5PcmRlcigpLFxuICAgICAgfSksIC4uLihwcm9wcy5kZXN0cm95U3RhY2s/LmNhbGwodGhpcywgYWNjb3VudCkgPyBbbmV3IENsb3VkRm9ybWF0aW9uRGVsZXRlU3RhY2tBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnRGVzdHJveVN0YWNrJyxcbiAgICAgICAgc3RhY2tOYW1lOiBgJHtwcm9wcy5yZXBvc2l0b3J5TmFtZX0tJHthY2NvdW50LnN0YWdlfWAsXG4gICAgICAgIGFkbWluUGVybWlzc2lvbnM6IHRydWUsXG4gICAgICAgIHJ1bk9yZGVyOiBwcmVwcm9kU3RhZ2UubmV4dFNlcXVlbnRpYWxSdW5PcmRlcigpXG4gICAgICB9KV0gOiBbXSkpO1xuICAgIH1cbiAgfVxufVxuIl19