import { IEndpointCredentialConfiguration } from "./iendpointcredentialconfiguration"

export enum EndpointType
{
    "Azure" = "Azure",
    "AzureOIDC" = "AzureOIDC",
    "SonarCloud" = "SonarCloud",
    "Snyk" = "Snyk",
    "Shared" = "Shared"
}

export interface IEndpointConfiguration
{
    name: string
    type: EndpointType
}

export interface ISharedEndpointConfiguration extends IEndpointConfiguration
{
    name: string,
    type: EndpointType.Shared
    sourceProject: string
}

export interface IAzureEndpointConfiguration extends IEndpointConfiguration
{
    name: string
    type: EndpointType.Azure
    tenantId: string
    identity: IAzureEndpointIdentity
    scope: IAzureEndpointScopeConfiguration
    credential: IEndpointCredentialConfiguration
}

export interface IAzureEndpointIdentity
{
    type: AzureIdentityType
    clientId: string
}

export enum AzureIdentityType
{
    "ServicePrincipal" = "ServicePrincipal"
}

export enum AzureEndpointScope
{
    "Subscription" = "Subscription",
    "ManagementGroup" = "ManagementGroup"
}

export interface IAzureEndpointScopeConfiguration
{
    type: AzureEndpointScope
    id: string
    name: string
}

export interface ISonarCloudEndpointConfiguration extends IEndpointConfiguration
{
    name: string
    type: EndpointType.SonarCloud
    organization: string
    credential: IEndpointCredentialConfiguration
}

export interface ISnykEndpointConfiguration extends IEndpointConfiguration
{
    name: string
    serverUrl: string
    type: EndpointType.Snyk
    credential: IEndpointCredentialConfiguration
}

export interface IEndpointConfigurationFile
{
    endpoints: IEndpointConfiguration[]
}