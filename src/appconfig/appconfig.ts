import { IAppConfig } from "./iappconfig";

export interface IAppConfigProps
{
    azDevToken?: string
    azDevUrl?: string
    projectsConfigurationPath?: string
    endpointsConfigurationPath?: string
    loggingLevel?: string
}

export class AppConfig implements IAppConfig
{
    private readonly _azDevToken: string
    private readonly _azDevUrl: string
    private readonly _projectsConfigurationPath: string
    private readonly _endpointsConfigurationPath: string
    private readonly _loggingLevel: string

    constructor(props?: IAppConfigProps)
    {
        const workingDirectory = process.cwd();
        const projectConfigPath = `${workingDirectory}/projects.json`;
        const endpointConfigPath = `${workingDirectory}/endpoints.json`;

        this._azDevToken = this.resolveConfigValue("DEVEND_AZDEV_TOKEN", props?.azDevToken);
        this._azDevUrl = this.resolveConfigValue("DEVEND_AZDEV_URL", props?.azDevUrl);
        this._loggingLevel = this.resolveConfigValue("DEVEND_LOGGING_LEVEL", props?.loggingLevel, "info");

        this._projectsConfigurationPath = this.resolveConfigValue(
            "DEVEND_PROJECTS_CONFIGURATION_PATH", props?.projectsConfigurationPath, projectConfigPath);

        this._endpointsConfigurationPath = this.resolveConfigValue(
            "DEVEND_ENDPOINTS_CONFIGURATION_PATH", props?.endpointsConfigurationPath, endpointConfigPath);
    }

    private resolveConfigValue(envKey: string, cliValue: string | undefined, defaultValue?: string): string 
    {
        const value = cliValue ?? process.env[envKey] ?? defaultValue;

        if (value === undefined)
        {
            throw new Error(`Configuration for '${envKey}' is required but was not provided.`);
        }

        return value;
    }

    public getAzDevToken(): string
    {
        return this._azDevToken;
    }

    public getAzDevUrl(): string
    {
        return this._azDevUrl;
    }

    public getProjectsConfigurationPath(): string
    {
        return this._projectsConfigurationPath;
    }

    public getEndpointsConfigurationPath(): string
    {
        return this._endpointsConfigurationPath;
    }

    public getLoggingLevel(): string
    {
        return this._loggingLevel;
    }
}