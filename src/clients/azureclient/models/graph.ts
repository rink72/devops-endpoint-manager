export interface IAzureServicePrincipal
{
    id: string
    appId: string
    displayName: string
    objectId: string
    tenantId: string
    type: string
}

export interface IAzureFederatedCredential
{
    id?: string
    name: string
    issuer: string
    subject: string
    description: string
    audiences: string[]
}

export interface IAzureGraphRestResponse<T>
{
    value: T[]
    count: number
}