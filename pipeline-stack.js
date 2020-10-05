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
                repo: 'alf-cdk-ui',
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
            var useOutputs = {};
            for (let cfnOutput in customStage.cfnOutputs) {
                useOutputs[cfnOutput] = cdkPipeline.stackOutput(customStage.cfnOutputs[cfnOutput]);
            }
            preprodStage.addActions(new pipelines_1.ShellScriptAction({
                actionName: 'TestCustomStack',
                useOutputs: useOutputs,
                // {
                //   // Get the stack Output from the Stage and make it available in
                //   // the shell script as $ENDPOINT_URL.
                //   ENDPOINT_URL: cdkPipeline.stackOutput(customStage.cfnOutputs.get('domainName') || new CfnOutput(this, 'empty', {value:''})),
                // }
                // ,
                commands: props.commands,
            }));
        }
    }
}
exports.PipelineStack = PipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBK0Q7QUFDL0QsZ0ZBQXVFO0FBQ3ZFLHdDQUFxRjtBQUNyRixrREFBb0c7QUFDcEcsd0VBQW1FO0FBQ25FLGlEQUE4QztBQUM5QyxpREFBNkM7QUFDN0MsbURBQW1FO0FBY25FLE1BQWEsYUFBYyxTQUFRLFlBQUs7SUFDdEMsWUFBWSxHQUFRLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ3pELEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXRCLFdBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFbkQsTUFBTSxLQUFLLEdBQUcsa0JBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFO1lBQ2pELFNBQVMsRUFBRSx1QkFBdUI7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxxQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzVELFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksMkJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzlDLGNBQWMsRUFBRSxZQUFZO1lBQzVCLHdCQUF3QixFQUFFLElBQUk7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7UUFDdEMsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLDJCQUFRLEVBQUUsQ0FBQztRQUU3QyxNQUFNLFdBQVcsR0FBRyxJQUFJLHVCQUFXLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUN2RCxvQkFBb0I7WUFDcEIsOENBQThDO1lBQzlDLHFCQUFxQjtZQUNyQixZQUFZLEVBQUUsUUFBUTtZQUV0QixnQ0FBZ0M7WUFDaEMsWUFBWSxFQUFFLElBQUksNkNBQWtCLENBQUM7Z0JBQ25DLFVBQVUsRUFBRSxjQUFjO2dCQUMxQixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07Z0JBQ3BCLEtBQUssRUFBRSxXQUFXO2dCQUNsQixJQUFJLEVBQUUsWUFBWTtnQkFDbEIsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLE1BQU0sRUFBRSxjQUFjO2FBQ3ZCLENBQUM7WUFFRix1Q0FBdUM7WUFDdkMsV0FBVyxFQUFFLDZCQUFpQixDQUFDLGdCQUFnQixDQUFDO2dCQUM5QyxjQUFjO2dCQUNkLHFCQUFxQjtnQkFDckIsY0FBYyxFQUFFLDBCQUEwQiwyQkFBWSxDQUFDLGVBQWUsQ0FBQyxFQUFFO2dCQUN6RSxZQUFZLEVBQUUsbUJBQW1CO2FBSWxDLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCw2QkFBNkI7UUFDN0IsS0FBSyxNQUFNLE9BQU8sSUFBSSxDQUFDLDBCQUFVLEVBQUUsMkJBQVcsQ0FBQyxFQUFFO1lBQy9DLGdEQUFnRDtZQUNoRCwwQkFBMEI7WUFDMUIsb0NBQW9DO1lBQ3BDLG9DQUFvQztZQUNwQyxrQ0FBa0M7WUFDbEMsMkRBQTJEO1lBQzNELHdDQUF3QztZQUN4QyxnQ0FBZ0M7WUFDaEMscUNBQXFDO1lBQ3JDLElBQUk7WUFDSixtR0FBbUc7WUFFbkcsTUFBTSxXQUFXLEdBQUcsSUFBSSwwQkFBVyxDQUFDLElBQUksRUFBRSxlQUFlLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDeEUsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM5QixzQ0FBc0M7Z0JBQ3RDLDZDQUE2QztnQkFDN0MsS0FBSztnQkFDTCxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFO29CQUNuQixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07aUJBQ3ZCO2FBQ0YsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUVaLCtDQUErQztZQUUvQyxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFHN0YsSUFBSSxVQUFVLEdBQWdDLEVBQUUsQ0FBQztZQUVqRCxLQUFJLElBQUksU0FBUyxJQUFJLFdBQVcsQ0FBQyxVQUFVLEVBQUM7Z0JBQzFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUNwRjtZQUVELFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSw2QkFBaUIsQ0FBQztnQkFDNUMsVUFBVSxFQUFFLGlCQUFpQjtnQkFDN0IsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLElBQUk7Z0JBQ0osb0VBQW9FO2dCQUNwRSwwQ0FBMEM7Z0JBQzFDLGlJQUFpSTtnQkFDakksSUFBSTtnQkFDSixJQUFJO2dCQUNKLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTthQUN6QixDQUFDLENBQUMsQ0FBQztTQUNMO0lBQ0gsQ0FBQztDQUNGO0FBbkdELHNDQW1HQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFydGlmYWN0LCBQaXBlbGluZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgR2l0SHViU291cmNlQWN0aW9uIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMsIFNlY3JldFZhbHVlLCBUYWdzLCBDb25zdHJ1Y3QgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENka1BpcGVsaW5lLCBTaGVsbFNjcmlwdEFjdGlvbiwgU2ltcGxlU3ludGhBY3Rpb24sIFN0YWNrT3V0cHV0IH0gZnJvbSBcIkBhd3MtY2RrL3BpcGVsaW5lc1wiO1xuaW1wb3J0IHsgQXV0b0RlbGV0ZUJ1Y2tldCB9IGZyb20gJ0Btb2JpbGVwb3NzZS9hdXRvLWRlbGV0ZS1idWNrZXQnO1xuaW1wb3J0IHsgZGVwZW5kZW5jaWVzIH0gZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgQ3VzdG9tU3RhZ2UgfSBmcm9tICcuL2N1c3RvbS1zdGFnZSc7XG5pbXBvcnQgeyBBY2NvdW50LCBkZXZBY2NvdW50LCBwcm9kQWNjb3VudCB9IGZyb20gJy4vYWNjb3VudENvbmZpZyc7XG5pbXBvcnQgeyBDdXN0b21TdGFjayB9IGZyb20gJy4vY3VzdG9tLXN0YWNrJztcblxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVTdGFja1Byb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7XG4gIC8vIGN1c3RvbVN0YWdlOiBTdGFnZTtcbiAgY3VzdG9tU3RhY2s6IChzY29wZTogQ29uc3RydWN0LCBhY2NvdW50OiBBY2NvdW50KSA9PiBDdXN0b21TdGFjaztcbiAgLy8gY3VzdG9tU3RhY2s6IEN1c3RvbVN0YWNrO1xuICBicmFuY2g6IHN0cmluZztcbiAgcmVwb3NpdG9yeU5hbWU6IHN0cmluZztcbiAgY29tbWFuZHM6IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzOiBQaXBlbGluZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihhcHAsIGlkLCBwcm9wcyk7XG5cbiAgICBUYWdzLm9mKHRoaXMpLmFkZCgnUGlwZWxpbmVTdGFjaycsIHRoaXMuc3RhY2tOYW1lKTtcblxuICAgIGNvbnN0IG9hdXRoID0gU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2FsZmNkaycsIHtcbiAgICAgIGpzb25GaWVsZDogJ211bGxlcjg4LWdpdGh1Yi10b2tlbicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgQXV0b0RlbGV0ZUJ1Y2tldCh0aGlzLCAnUGlwZUJ1Y2tldCcsIHtcbiAgICAgIHZlcnNpb25lZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IFBpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIGFydGlmYWN0QnVja2V0OiBzb3VyY2VCdWNrZXQsXG4gICAgICByZXN0YXJ0RXhlY3V0aW9uT25VcGRhdGU6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3VyY2VBcnRpZmFjdCA9IG5ldyBBcnRpZmFjdCgpO1xuICAgIGNvbnN0IGNsb3VkQXNzZW1ibHlBcnRpZmFjdCA9IG5ldyBBcnRpZmFjdCgpO1xuXG4gICAgY29uc3QgY2RrUGlwZWxpbmUgPSBuZXcgQ2RrUGlwZWxpbmUodGhpcywgJ0Nka1BpcGVsaW5lJywge1xuICAgICAgLy8gVGhlIHBpcGVsaW5lIG5hbWVcbiAgICAgIC8vIHBpcGVsaW5lTmFtZTogYCR7dGhpcy5zdGFja05hbWV9LXBpcGVsaW5lYCxcbiAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgIGNvZGVQaXBlbGluZTogcGlwZWxpbmUsXG5cbiAgICAgIC8vIFdoZXJlIHRoZSBzb3VyY2UgY2FuIGJlIGZvdW5kXG4gICAgICBzb3VyY2VBY3Rpb246IG5ldyBHaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnR2l0aHViU291cmNlJyxcbiAgICAgICAgYnJhbmNoOiBwcm9wcy5icmFuY2gsXG4gICAgICAgIG93bmVyOiAnbW11bGxlcjg4JyxcbiAgICAgICAgcmVwbzogJ2FsZi1jZGstdWknLFxuICAgICAgICBvYXV0aFRva2VuOiBvYXV0aCxcbiAgICAgICAgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgIH0pLFxuXG4gICAgICAvLyBIb3cgaXQgd2lsbCBiZSBidWlsdCBhbmQgc3ludGhlc2l6ZWRcbiAgICAgIHN5bnRoQWN0aW9uOiBTaW1wbGVTeW50aEFjdGlvbi5zdGFuZGFyZE5wbVN5bnRoKHtcbiAgICAgICAgc291cmNlQXJ0aWZhY3QsXG4gICAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgICAgaW5zdGFsbENvbW1hbmQ6IGBucG0gaW5zdGFsbCAtZyBhd3MtY2RrQCR7ZGVwZW5kZW5jaWVzWydAYXdzLWNkay9jb3JlJ119YCxcbiAgICAgICAgc3ludGhDb21tYW5kOiAnbWFrZSBjZGtzeW50aHByb2QnLFxuICAgICAgICAvLyBzdWJkaXJlY3Rvcnk6ICdjZGsnLFxuICAgICAgICAvLyBXZSBuZWVkIGEgYnVpbGQgc3RlcCB0byBjb21waWxlIHRoZSBUeXBlU2NyaXB0IExhbWJkYVxuICAgICAgICAvLyBidWlsZENvbW1hbmQ6ICdtYWtlIGJ1aWxkICYmIG1ha2UgY2RrYnVpbGQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyB0b2RvOiBhZGQgZGV2QWNjb3VudCBsYXRlclxuICAgIGZvciAoY29uc3QgYWNjb3VudCBvZiBbZGV2QWNjb3VudCwgcHJvZEFjY291bnRdKSB7XG4gICAgICAvLyBjb25zdCBjdXN0b21TdGFja1Byb3BzIDogQ3VzdG9tU3RhY2tQcm9wcyA9IHtcbiAgICAgIC8vICAgc3RhZ2U6IGFjY291bnQuc3RhZ2UsXG4gICAgICAvLyAgIGRvbWFpbk5hbWU6IGFjY291bnQuZG9tYWluTmFtZSxcbiAgICAgIC8vICAgYWNtQ2VydFJlZjogYWNjb3VudC5hY21DZXJ0UmVmLFxuICAgICAgLy8gICBzdWJEb21haW46IGFjY291bnQuc3ViRG9tYWluLFxuICAgICAgLy8gICBzdGFja05hbWU6IGAke3Byb3BzLnJlcG9zaXRvcnlOYW1lfS0ke2FjY291bnQuc3RhZ2V9YCxcbiAgICAgIC8vICAgaG9zdGVkWm9uZUlkOiBhY2NvdW50Lmhvc3RlZFpvbmVJZCxcbiAgICAgIC8vICAgem9uZU5hbWU6IGFjY291bnQuem9uZU5hbWUsXG4gICAgICAvLyAgIC8vIHN1YkRvbWFpbjogYWNjb3VudC5zdWJEb21haW4sXG4gICAgICAvLyB9XG4gICAgICAvLyBjb25zb2xlLmluZm8oYCR7YWNjb3VudC5zdGFnZX0gQ3VzdG9tU3RhY2tQcm9wczogJHtKU09OLnN0cmluZ2lmeShjdXN0b21TdGFja1Byb3BzLCBudWxsLCAyKX1gKTtcblxuICAgICAgY29uc3QgY3VzdG9tU3RhZ2UgPSBuZXcgQ3VzdG9tU3RhZ2UodGhpcywgYEN1c3RvbVN0YWdlLSR7YWNjb3VudC5zdGFnZX1gLCB7XG4gICAgICAgIGN1c3RvbVN0YWNrOiBwcm9wcy5jdXN0b21TdGFjayxcbiAgICAgICAgLy8gY3VzdG9tU3RhY2s6IChfc2NvcGUsIGFjY291bnQpID0+IHtcbiAgICAgICAgLy8gICByZXR1cm4gcHJvcHMuY3VzdG9tU3RhY2sodGhpcywgYWNjb3VudCk7XG4gICAgICAgIC8vIH0sXG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6IGFjY291bnQuaWQsXG4gICAgICAgICAgcmVnaW9uOiBhY2NvdW50LnJlZ2lvbixcbiAgICAgICAgfVxuICAgICAgfSwgYWNjb3VudCk7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjdXN0b21TdGFnZSA9ICcgKyBjdXN0b21TdGFnZSk7XG5cbiAgICAgIGNvbnN0IHByZXByb2RTdGFnZSA9IGNka1BpcGVsaW5lLmFkZEFwcGxpY2F0aW9uU3RhZ2UoY3VzdG9tU3RhZ2UsIHsgbWFudWFsQXBwcm92YWxzOiB0cnVlIH0pO1xuXG4gICAgICBcbiAgICAgIHZhciB1c2VPdXRwdXRzOiBSZWNvcmQ8c3RyaW5nLCBTdGFja091dHB1dD4gPSB7fTtcblxuICAgICAgZm9yKGxldCBjZm5PdXRwdXQgaW4gY3VzdG9tU3RhZ2UuY2ZuT3V0cHV0cyl7XG4gICAgICAgIHVzZU91dHB1dHNbY2ZuT3V0cHV0XSA9IGNka1BpcGVsaW5lLnN0YWNrT3V0cHV0KGN1c3RvbVN0YWdlLmNmbk91dHB1dHNbY2ZuT3V0cHV0XSk7XG4gICAgICB9XG5cbiAgICAgIHByZXByb2RTdGFnZS5hZGRBY3Rpb25zKG5ldyBTaGVsbFNjcmlwdEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdUZXN0Q3VzdG9tU3RhY2snLFxuICAgICAgICB1c2VPdXRwdXRzOiB1c2VPdXRwdXRzLFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgLy8gR2V0IHRoZSBzdGFjayBPdXRwdXQgZnJvbSB0aGUgU3RhZ2UgYW5kIG1ha2UgaXQgYXZhaWxhYmxlIGluXG4gICAgICAgIC8vICAgLy8gdGhlIHNoZWxsIHNjcmlwdCBhcyAkRU5EUE9JTlRfVVJMLlxuICAgICAgICAvLyAgIEVORFBPSU5UX1VSTDogY2RrUGlwZWxpbmUuc3RhY2tPdXRwdXQoY3VzdG9tU3RhZ2UuY2ZuT3V0cHV0cy5nZXQoJ2RvbWFpbk5hbWUnKSB8fCBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdlbXB0eScsIHt2YWx1ZTonJ30pKSxcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyAsXG4gICAgICAgIGNvbW1hbmRzOiBwcm9wcy5jb21tYW5kcyxcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==