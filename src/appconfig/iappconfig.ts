export interface IAppConfig
{
    getAzDevToken(): string
    getAzDevUrl(): string
    getProjectsConfigurationPath(): string
    getEndpointsConfigurationPath(): string
    getLoggingLevel(): string
}