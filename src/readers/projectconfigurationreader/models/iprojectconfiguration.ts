export interface IProjectEndpointReference
{
    name: string
}

export interface IProjectConfiguration
{
    name: string
    removeObsoleteEndpoints: boolean
    endpoints: IProjectEndpointReference[]
}

export interface IProjectConfigurationFile
{
    projects: IProjectConfiguration[]
}