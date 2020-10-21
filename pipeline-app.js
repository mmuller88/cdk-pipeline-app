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
            manualApprovals: props.manualApprovals,
            testCommands: props.testCommands,
        };
        console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);
        // tslint:disable-next-line: no-unused-expression
        new pipeline_stack_1.PipelineStack(this, `${props.repositoryName}-pipeline-stack-build`, pipelineStackProps);
        this.synth();
    }
}
exports.PipelineApp = PipelineApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBeUQ7QUFDekQscURBQXFFO0FBb0JyRSxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELGtDQUFrQztRQUNsQyxLQUFJLE1BQU0sYUFBYSxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDOUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztTQUNuRDtRQUVELE1BQU0sa0JBQWtCLEdBQXVCO1lBQzdDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixzQ0FBc0M7WUFDdEMsNkNBQTZDO1lBQzdDLEtBQUs7WUFDTCxHQUFHLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDOUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTTthQUNsQztZQUNELE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDcEMsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ2xDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7WUFDdEMsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1NBQ2pDLENBQUM7UUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkYsaURBQWlEO1FBQ2pELElBQUksOEJBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyx1QkFBdUIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7Q0FDRjtBQWhDRCxrQ0FnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgeyBBcHAsIEFwcFByb3BzLCBDb25zdHJ1Y3QgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFBpcGVsaW5lU3RhY2tQcm9wcywgUGlwZWxpbmVTdGFjayB9IGZyb20gJy4vcGlwZWxpbmUtc3RhY2snO1xuaW1wb3J0IHsgQ3VzdG9tU3RhY2sgfSBmcm9tICcuL2N1c3RvbS1zdGFjayc7XG5cbmltcG9ydCB7IEFjY291bnQsIFN0YWdlQWNjb3VudCB9IGZyb20gJy4vYWNjb3VudENvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVBcHBQcm9wcyBleHRlbmRzIEFwcFByb3BzIHtcbiAgLy8gY3VzdG9tU3RhZ2U6IFN0YWdlO1xuICBzdGFnZUFjY291bnRzOiBTdGFnZUFjY291bnRbXTtcbiAgYnVpbGRBY2NvdW50OiBBY2NvdW50O1xuICBjdXN0b21TdGFjazogKHNjb3BlOiBDb25zdHJ1Y3QsIHN0YWdlQWNjb3VudDogU3RhZ2VBY2NvdW50KSA9PiBDdXN0b21TdGFjaztcbiAgYnJhbmNoOiBzdHJpbmc7XG4gIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBPcHRpb25hbCBCdWlsZCBDb21tYW5kIGR1cmluZyB0aGUgU3ludGggQWN0aW9uXG4gICAqL1xuICBidWlsZENvbW1hbmQ/OiBzdHJpbmc7XG4gIG1hbnVhbEFwcHJvdmFscz86IChzdGFnZUFjY291bnQ6IFN0YWdlQWNjb3VudCkgPT4gYm9vbGVhbjtcbiAgdGVzdENvbW1hbmRzOiAoc3RhZ2VBY2NvdW50OiBTdGFnZUFjY291bnQpID0+IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVBcHAgZXh0ZW5kcyBBcHAge1xuICBjb25zdHJ1Y3Rvcihwcm9wczogUGlwZWxpbmVBcHBQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICAvLyBUYWdzLm9mKHRoaXMpLmFkZCgnUHJvamVjdCcsIHByb3BzLnJlcG9zaXRvcnlOYW1lKTtcblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZm9yaW5cbiAgICBmb3IoY29uc3Qgc3RhZ2VBY2NvdW50cyBvZiBwcm9wcy5zdGFnZUFjY291bnRzKSB7XG4gICAgICBwcm9wcy5jdXN0b21TdGFjay5jYWxsKHRoaXMsIHRoaXMsIHN0YWdlQWNjb3VudHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHBpcGVsaW5lU3RhY2tQcm9wczogUGlwZWxpbmVTdGFja1Byb3BzID0ge1xuICAgICAgY3VzdG9tU3RhY2s6IHByb3BzLmN1c3RvbVN0YWNrLFxuICAgICAgLy8gY3VzdG9tU3RhY2s6IChfc2NvcGUsIGFjY291bnQpID0+IHtcbiAgICAgIC8vICAgcmV0dXJuIHByb3BzLmN1c3RvbVN0YWNrKHRoaXMsIGFjY291bnQpO1xuICAgICAgLy8gfSxcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiBwcm9wcy5idWlsZEFjY291bnQuaWQsXG4gICAgICAgIHJlZ2lvbjogcHJvcHMuYnVpbGRBY2NvdW50LnJlZ2lvbixcbiAgICAgIH0sXG4gICAgICBicmFuY2g6IHByb3BzLmJyYW5jaCxcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiBwcm9wcy5yZXBvc2l0b3J5TmFtZSxcbiAgICAgIHN0YWdlQWNjb3VudHM6IHByb3BzLnN0YWdlQWNjb3VudHMsXG4gICAgICBidWlsZENvbW1hbmQ6IHByb3BzLmJ1aWxkQ29tbWFuZCxcbiAgICAgIG1hbnVhbEFwcHJvdmFsczogcHJvcHMubWFudWFsQXBwcm92YWxzLFxuICAgICAgdGVzdENvbW1hbmRzOiBwcm9wcy50ZXN0Q29tbWFuZHMsXG4gICAgfTtcbiAgICBjb25zb2xlLmluZm8oYHBpcGVsaW5lU3RhY2tQcm9wczogJHtKU09OLnN0cmluZ2lmeShwaXBlbGluZVN0YWNrUHJvcHMsIG51bGwsIDIpfWApO1xuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bnVzZWQtZXhwcmVzc2lvblxuICAgIG5ldyBQaXBlbGluZVN0YWNrKHRoaXMsIGAke3Byb3BzLnJlcG9zaXRvcnlOYW1lfS1waXBlbGluZS1zdGFjay1idWlsZGAsIHBpcGVsaW5lU3RhY2tQcm9wcyk7XG4gICAgdGhpcy5zeW50aCgpO1xuICB9XG59XG4iXX0=