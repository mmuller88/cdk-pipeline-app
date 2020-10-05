#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineApp = void 0;
const core_1 = require("@aws-cdk/core");
const pipeline_stack_1 = require("./pipeline-stack");
const accountConfig_1 = require("./accountConfig");
class PipelineApp extends core_1.App {
    constructor(props) {
        super(props);
        // Tags.of(this).add('Project', props.repositoryName);
        for (const account of [accountConfig_1.devAccount, accountConfig_1.prodAccount]) {
            props.customStack.call(this, this, account);
        }
        const pipelineStackProps = {
            customStack: props.customStack,
            // customStack: (_scope, account) => {
            //   return props.customStack(this, account);
            // },
            env: {
                account: accountConfig_1.devAccount.id,
                region: accountConfig_1.devAccount.region,
            },
            branch: props.branch,
            repositoryName: props.repositoryName,
            commands: props.testCommands,
        };
        console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);
        // tslint:disable-next-line: no-unused-expression
        new pipeline_stack_1.PipelineStack(this, `${props.repositoryName}-pipeline-stack-build`, pipelineStackProps);
        this.synth();
    }
}
exports.PipelineApp = PipelineApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBeUQ7QUFDekQscURBQXFFO0FBR3JFLG1EQUFtRTtBQVVuRSxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELEtBQUksTUFBTSxPQUFPLElBQUksQ0FBQywwQkFBVSxFQUFFLDJCQUFXLENBQUMsRUFBRTtZQUM5QyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBRUQsTUFBTSxrQkFBa0IsR0FBdUI7WUFDN0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLHNDQUFzQztZQUN0Qyw2Q0FBNkM7WUFDN0MsS0FBSztZQUNMLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsMEJBQVUsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLEVBQUUsMEJBQVUsQ0FBQyxNQUFNO2FBQzFCO1lBQ0QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVk7U0FDN0IsQ0FBQztRQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuRixpREFBaUQ7UUFDakQsSUFBSSw4QkFBYSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxjQUFjLHVCQUF1QixFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDNUYsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztDQUNGO0FBNUJELGtDQTRCQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCB7IEFwcCwgQXBwUHJvcHMsIENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGFja1Byb3BzLCBQaXBlbGluZVN0YWNrIH0gZnJvbSAnLi9waXBlbGluZS1zdGFjayc7XG5pbXBvcnQgeyBDdXN0b21TdGFjayB9IGZyb20gJy4vY3VzdG9tLXN0YWNrJztcblxuaW1wb3J0IHsgQWNjb3VudCwgZGV2QWNjb3VudCwgcHJvZEFjY291bnQgfSBmcm9tICcuL2FjY291bnRDb25maWcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpcGVsaW5lQXBwUHJvcHMgZXh0ZW5kcyBBcHBQcm9wcyB7XG4gIC8vIGN1c3RvbVN0YWdlOiBTdGFnZTtcbiAgY3VzdG9tU3RhY2s6IChzY29wZTogQ29uc3RydWN0LCBhY2NvdW50OiBBY2NvdW50KSA9PiBDdXN0b21TdGFjaztcbiAgYnJhbmNoOiBzdHJpbmc7XG4gIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIHRlc3RDb21tYW5kczogc3RyaW5nW107XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZUFwcCBleHRlbmRzIEFwcCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQaXBlbGluZUFwcFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIC8vIFRhZ3Mub2YodGhpcykuYWRkKCdQcm9qZWN0JywgcHJvcHMucmVwb3NpdG9yeU5hbWUpO1xuXG4gICAgZm9yKGNvbnN0IGFjY291bnQgb2YgW2RldkFjY291bnQsIHByb2RBY2NvdW50XSkge1xuICAgICAgcHJvcHMuY3VzdG9tU3RhY2suY2FsbCh0aGlzLCB0aGlzLCBhY2NvdW50KTtcbiAgICB9XG5cbiAgICBjb25zdCBwaXBlbGluZVN0YWNrUHJvcHM6IFBpcGVsaW5lU3RhY2tQcm9wcyA9IHtcbiAgICAgIGN1c3RvbVN0YWNrOiBwcm9wcy5jdXN0b21TdGFjayxcbiAgICAgIC8vIGN1c3RvbVN0YWNrOiAoX3Njb3BlLCBhY2NvdW50KSA9PiB7XG4gICAgICAvLyAgIHJldHVybiBwcm9wcy5jdXN0b21TdGFjayh0aGlzLCBhY2NvdW50KTtcbiAgICAgIC8vIH0sXG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogZGV2QWNjb3VudC5pZCxcbiAgICAgICAgcmVnaW9uOiBkZXZBY2NvdW50LnJlZ2lvbixcbiAgICAgIH0sXG4gICAgICBicmFuY2g6IHByb3BzLmJyYW5jaCxcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiBwcm9wcy5yZXBvc2l0b3J5TmFtZSxcbiAgICAgIGNvbW1hbmRzOiBwcm9wcy50ZXN0Q29tbWFuZHMsXG4gICAgfTtcbiAgICBjb25zb2xlLmluZm8oYHBpcGVsaW5lU3RhY2tQcm9wczogJHtKU09OLnN0cmluZ2lmeShwaXBlbGluZVN0YWNrUHJvcHMsIG51bGwsIDIpfWApO1xuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bnVzZWQtZXhwcmVzc2lvblxuICAgIG5ldyBQaXBlbGluZVN0YWNrKHRoaXMsIGAke3Byb3BzLnJlcG9zaXRvcnlOYW1lfS1waXBlbGluZS1zdGFjay1idWlsZGAsIHBpcGVsaW5lU3RhY2tQcm9wcyk7XG4gICAgdGhpcy5zeW50aCgpO1xuICB9XG59XG4iXX0=