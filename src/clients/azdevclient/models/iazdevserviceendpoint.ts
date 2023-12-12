import { ServiceEndpoint } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";

export interface IAzDevProjectReference
{
    name?: string
    id: string
}

export interface IAzDevServiceEndpointProjectReferences
{
    name: string
    description?: string
    projectReference: IAzDevProjectReference
}

export interface IAzDevServiceEndpoint extends ServiceEndpoint
{
    serviceEndpointProjectReferences: IAzDevServiceEndpointProjectReferences[]
}