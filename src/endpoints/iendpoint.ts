import { ServiceEndpoint } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";

export interface IEndpoint
{
    createEndpoint(projectId: string): Promise<ServiceEndpoint>
}