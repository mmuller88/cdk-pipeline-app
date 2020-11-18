#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineApp = void 0;
const core_1 = require("@aws-cdk/core");
const pipeline_stack_1 = require("./pipeline-stack");
class PipelineApp extends core_1.App {
    constructor(props) {
        super(props);
        // Tags.of(this).add('Project', props.repositoryName);
        // tslint:disable-next-line: forin
        for (const stageAccounts of props.stageAccounts) {
            props.customStack.call(this, this, stageAccounts);
        }
        const pipelineStackProps = {
            customStack: props.customStack,
            // customStack: (_scope, account) => {
            //   return props.customStack(this, account);
            // },
            env: {
                account: props.buildAccount.id,
                region: props.buildAccount.region,
            },
            branch: props.branch,
            repositoryName: props.repositoryName,
            stageAccounts: props.stageAccounts,
            buildCommand: props.buildCommand,
            gitHub: props.gitHub,
            manualApprovals: props.manualApprovals,
            testCommands: props.testCommands,
        };
        console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);
        // tslint:disable-next-line: no-unused-expression
        new pipeline_stack_1.PipelineStack(this, `${props.repositoryName}-pipeline`, pipelineStackProps);
        this.synth();
    }
}
exports.PipelineApp = PipelineApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBc0U7QUFDdEUscURBQXFFO0FBd0JyRSxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELGtDQUFrQztRQUNsQyxLQUFLLE1BQU0sYUFBYSxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDL0MsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztTQUNuRDtRQUVELE1BQU0sa0JBQWtCLEdBQXVCO1lBQzdDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixzQ0FBc0M7WUFDdEMsNkNBQTZDO1lBQzdDLEtBQUs7WUFDTCxHQUFHLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDOUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTTthQUNsQztZQUNELE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDcEMsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ2xDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO1lBQ3RDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtTQUNqQyxDQUFDO1FBQ0YsT0FBTyxDQUFDLElBQUksQ0FDVix1QkFBdUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FDckUsQ0FBQztRQUVGLGlEQUFpRDtRQUNqRCxJQUFJLDhCQUFhLENBQ2YsSUFBSSxFQUNKLEdBQUcsS0FBSyxDQUFDLGNBQWMsV0FBVyxFQUNsQyxrQkFBa0IsQ0FDbkIsQ0FBQztRQUNGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7Q0FDRjtBQXZDRCxrQ0F1Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgeyBBcHAsIEFwcFByb3BzLCBDb25zdHJ1Y3QsIFNlY3JldFZhbHVlIH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RhY2tQcm9wcywgUGlwZWxpbmVTdGFjayB9IGZyb20gXCIuL3BpcGVsaW5lLXN0YWNrXCI7XG5pbXBvcnQgeyBDdXN0b21TdGFjayB9IGZyb20gXCIuL2N1c3RvbS1zdGFja1wiO1xuXG5pbXBvcnQgeyBBY2NvdW50LCBTdGFnZUFjY291bnQgfSBmcm9tIFwiLi9hY2NvdW50Q29uZmlnXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVBcHBQcm9wcyBleHRlbmRzIEFwcFByb3BzIHtcbiAgLy8gY3VzdG9tU3RhZ2U6IFN0YWdlO1xuICBzdGFnZUFjY291bnRzOiBTdGFnZUFjY291bnRbXTtcbiAgYnVpbGRBY2NvdW50OiBBY2NvdW50O1xuICBjdXN0b21TdGFjazogKHNjb3BlOiBDb25zdHJ1Y3QsIHN0YWdlQWNjb3VudDogU3RhZ2VBY2NvdW50KSA9PiBDdXN0b21TdGFjaztcbiAgYnJhbmNoOiBzdHJpbmc7XG4gIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBPcHRpb25hbCBCdWlsZCBDb21tYW5kIGR1cmluZyB0aGUgU3ludGggQWN0aW9uXG4gICAqL1xuICBidWlsZENvbW1hbmQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBY2Nlc3MgY3JlZGVudGlhbHMgZm9yIHVzaW5nIHRoZSBwaXBlIHdpdGggZ2l0aHViLiBPdGhlciBnaXQgcHJvdmlkZXJzIGFyZSBjdXJyZW50bHkgbm90IHN1cHBvcnRlZC5cbiAgICovXG4gIGdpdEh1YjogeyBvd25lcjogc3RyaW5nOyBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZSB9O1xuICBtYW51YWxBcHByb3ZhbHM/OiAoc3RhZ2VBY2NvdW50OiBTdGFnZUFjY291bnQpID0+IGJvb2xlYW47XG4gIHRlc3RDb21tYW5kczogKHN0YWdlQWNjb3VudDogU3RhZ2VBY2NvdW50KSA9PiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lQXBwIGV4dGVuZHMgQXBwIHtcbiAgY29uc3RydWN0b3IocHJvcHM6IFBpcGVsaW5lQXBwUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgLy8gVGFncy5vZih0aGlzKS5hZGQoJ1Byb2plY3QnLCBwcm9wcy5yZXBvc2l0b3J5TmFtZSk7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGZvcmluXG4gICAgZm9yIChjb25zdCBzdGFnZUFjY291bnRzIG9mIHByb3BzLnN0YWdlQWNjb3VudHMpIHtcbiAgICAgIHByb3BzLmN1c3RvbVN0YWNrLmNhbGwodGhpcywgdGhpcywgc3RhZ2VBY2NvdW50cyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGlwZWxpbmVTdGFja1Byb3BzOiBQaXBlbGluZVN0YWNrUHJvcHMgPSB7XG4gICAgICBjdXN0b21TdGFjazogcHJvcHMuY3VzdG9tU3RhY2ssXG4gICAgICAvLyBjdXN0b21TdGFjazogKF9zY29wZSwgYWNjb3VudCkgPT4ge1xuICAgICAgLy8gICByZXR1cm4gcHJvcHMuY3VzdG9tU3RhY2sodGhpcywgYWNjb3VudCk7XG4gICAgICAvLyB9LFxuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6IHByb3BzLmJ1aWxkQWNjb3VudC5pZCxcbiAgICAgICAgcmVnaW9uOiBwcm9wcy5idWlsZEFjY291bnQucmVnaW9uLFxuICAgICAgfSxcbiAgICAgIGJyYW5jaDogcHJvcHMuYnJhbmNoLFxuICAgICAgcmVwb3NpdG9yeU5hbWU6IHByb3BzLnJlcG9zaXRvcnlOYW1lLFxuICAgICAgc3RhZ2VBY2NvdW50czogcHJvcHMuc3RhZ2VBY2NvdW50cyxcbiAgICAgIGJ1aWxkQ29tbWFuZDogcHJvcHMuYnVpbGRDb21tYW5kLFxuICAgICAgZ2l0SHViOiBwcm9wcy5naXRIdWIsXG4gICAgICBtYW51YWxBcHByb3ZhbHM6IHByb3BzLm1hbnVhbEFwcHJvdmFscyxcbiAgICAgIHRlc3RDb21tYW5kczogcHJvcHMudGVzdENvbW1hbmRzLFxuICAgIH07XG4gICAgY29uc29sZS5pbmZvKFxuICAgICAgYHBpcGVsaW5lU3RhY2tQcm9wczogJHtKU09OLnN0cmluZ2lmeShwaXBlbGluZVN0YWNrUHJvcHMsIG51bGwsIDIpfWBcbiAgICApO1xuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bnVzZWQtZXhwcmVzc2lvblxuICAgIG5ldyBQaXBlbGluZVN0YWNrKFxuICAgICAgdGhpcyxcbiAgICAgIGAke3Byb3BzLnJlcG9zaXRvcnlOYW1lfS1waXBlbGluZWAsXG4gICAgICBwaXBlbGluZVN0YWNrUHJvcHNcbiAgICApO1xuICAgIHRoaXMuc3ludGgoKTtcbiAgfVxufVxuIl19