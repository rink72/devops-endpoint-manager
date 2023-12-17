export enum EndpointCredentialType
{
    "EnvironmentVariable" = "EnvironmentVariable",
    "OIDC" = "OIDC",
    "KeyVault" = "KeyVault",
    "SpnKey" = "SpnKey"
}

export interface IEndpointEnvironmentVariableCredentialConfiguration
{
    type: EndpointCredentialType.EnvironmentVariable
    variableName: string
}

export interface IEndpointOIDCCredentialConfiguration
{
    type: EndpointCredentialType.OIDC
}

export interface IEndpointKeyVaultCredentialConfiguration
{
    type: EndpointCredentialType.KeyVault
    keyVault: string
    secretName: string
}

export interface IEndpointSpnKeyCredentialConfiguration
{
    type: EndpointCredentialType.SpnKey
    daysValid: number
}

export interface IEndpointOidcCredentialConfiguration
{
    type: EndpointCredentialType.OIDC
}

export type IEndpointCredentialConfiguration = IEndpointEnvironmentVariableCredentialConfiguration
    | IEndpointOIDCCredentialConfiguration
    | IEndpointKeyVaultCredentialConfiguration
    | IEndpointSpnKeyCredentialConfiguration
    | IEndpointOidcCredentialConfiguration