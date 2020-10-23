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
        new pipeline_stack_1.PipelineStack(this, `${props.repositoryName}-pipeline`, pipelineStackProps);
        this.synth();
    }
}
exports.PipelineApp = PipelineApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBeUQ7QUFDekQscURBQXFFO0FBb0JyRSxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELGtDQUFrQztRQUNsQyxLQUFJLE1BQU0sYUFBYSxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDOUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztTQUNuRDtRQUVELE1BQU0sa0JBQWtCLEdBQXVCO1lBQzdDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixzQ0FBc0M7WUFDdEMsNkNBQTZDO1lBQzdDLEtBQUs7WUFDTCxHQUFHLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDOUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTTthQUNsQztZQUNELE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDcEMsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ2xDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7WUFDdEMsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1NBQ2pDLENBQUM7UUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkYsaURBQWlEO1FBQ2pELElBQUksOEJBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyxXQUFXLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNoRixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUFoQ0Qsa0NBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IHsgQXBwLCBBcHBQcm9wcywgQ29uc3RydWN0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBQaXBlbGluZVN0YWNrUHJvcHMsIFBpcGVsaW5lU3RhY2sgfSBmcm9tICcuL3BpcGVsaW5lLXN0YWNrJztcbmltcG9ydCB7IEN1c3RvbVN0YWNrIH0gZnJvbSAnLi9jdXN0b20tc3RhY2snO1xuXG5pbXBvcnQgeyBBY2NvdW50LCBTdGFnZUFjY291bnQgfSBmcm9tICcuL2FjY291bnRDb25maWcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpcGVsaW5lQXBwUHJvcHMgZXh0ZW5kcyBBcHBQcm9wcyB7XG4gIC8vIGN1c3RvbVN0YWdlOiBTdGFnZTtcbiAgc3RhZ2VBY2NvdW50czogU3RhZ2VBY2NvdW50W107XG4gIGJ1aWxkQWNjb3VudDogQWNjb3VudDtcbiAgY3VzdG9tU3RhY2s6IChzY29wZTogQ29uc3RydWN0LCBzdGFnZUFjY291bnQ6IFN0YWdlQWNjb3VudCkgPT4gQ3VzdG9tU3RhY2s7XG4gIGJyYW5jaDogc3RyaW5nO1xuICByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogT3B0aW9uYWwgQnVpbGQgQ29tbWFuZCBkdXJpbmcgdGhlIFN5bnRoIEFjdGlvblxuICAgKi9cbiAgYnVpbGRDb21tYW5kPzogc3RyaW5nO1xuICBtYW51YWxBcHByb3ZhbHM/OiAoc3RhZ2VBY2NvdW50OiBTdGFnZUFjY291bnQpID0+IGJvb2xlYW47XG4gIHRlc3RDb21tYW5kczogKHN0YWdlQWNjb3VudDogU3RhZ2VBY2NvdW50KSA9PiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lQXBwIGV4dGVuZHMgQXBwIHtcbiAgY29uc3RydWN0b3IocHJvcHM6IFBpcGVsaW5lQXBwUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgLy8gVGFncy5vZih0aGlzKS5hZGQoJ1Byb2plY3QnLCBwcm9wcy5yZXBvc2l0b3J5TmFtZSk7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGZvcmluXG4gICAgZm9yKGNvbnN0IHN0YWdlQWNjb3VudHMgb2YgcHJvcHMuc3RhZ2VBY2NvdW50cykge1xuICAgICAgcHJvcHMuY3VzdG9tU3RhY2suY2FsbCh0aGlzLCB0aGlzLCBzdGFnZUFjY291bnRzKTtcbiAgICB9XG5cbiAgICBjb25zdCBwaXBlbGluZVN0YWNrUHJvcHM6IFBpcGVsaW5lU3RhY2tQcm9wcyA9IHtcbiAgICAgIGN1c3RvbVN0YWNrOiBwcm9wcy5jdXN0b21TdGFjayxcbiAgICAgIC8vIGN1c3RvbVN0YWNrOiAoX3Njb3BlLCBhY2NvdW50KSA9PiB7XG4gICAgICAvLyAgIHJldHVybiBwcm9wcy5jdXN0b21TdGFjayh0aGlzLCBhY2NvdW50KTtcbiAgICAgIC8vIH0sXG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogcHJvcHMuYnVpbGRBY2NvdW50LmlkLFxuICAgICAgICByZWdpb246IHByb3BzLmJ1aWxkQWNjb3VudC5yZWdpb24sXG4gICAgICB9LFxuICAgICAgYnJhbmNoOiBwcm9wcy5icmFuY2gsXG4gICAgICByZXBvc2l0b3J5TmFtZTogcHJvcHMucmVwb3NpdG9yeU5hbWUsXG4gICAgICBzdGFnZUFjY291bnRzOiBwcm9wcy5zdGFnZUFjY291bnRzLFxuICAgICAgYnVpbGRDb21tYW5kOiBwcm9wcy5idWlsZENvbW1hbmQsXG4gICAgICBtYW51YWxBcHByb3ZhbHM6IHByb3BzLm1hbnVhbEFwcHJvdmFscyxcbiAgICAgIHRlc3RDb21tYW5kczogcHJvcHMudGVzdENvbW1hbmRzLFxuICAgIH07XG4gICAgY29uc29sZS5pbmZvKGBwaXBlbGluZVN0YWNrUHJvcHM6ICR7SlNPTi5zdHJpbmdpZnkocGlwZWxpbmVTdGFja1Byb3BzLCBudWxsLCAyKX1gKTtcblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW51c2VkLWV4cHJlc3Npb25cbiAgICBuZXcgUGlwZWxpbmVTdGFjayh0aGlzLCBgJHtwcm9wcy5yZXBvc2l0b3J5TmFtZX0tcGlwZWxpbmVgLCBwaXBlbGluZVN0YWNrUHJvcHMpO1xuICAgIHRoaXMuc3ludGgoKTtcbiAgfVxufVxuIl19