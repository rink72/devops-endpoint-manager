import { ILogger } from "../logger/ilogger"
import { IEndpointEnvironmentVariableCredentialConfiguration } from "../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration"
import { ICredential } from "./icredential"

export interface IEnvironmentVariableCredential
{
    logger: ILogger
    credentialConfiguration: IEndpointEnvironmentVariableCredentialConfiguration
}

export class EnvironmentVariableCredential implements ICredential
{
    private readonly _logger: ILogger
    private readonly _credentialConfiguration: IEndpointEnvironmentVariableCredentialConfiguration

    constructor(props: IEnvironmentVariableCredential)
    {
        this._logger = props.logger
        this._credentialConfiguration = props.credentialConfiguration
    }

    public async getCredential(rotate: boolean): Promise<string>
    {
        this._logger.debug(`Retrieving credential from <${this._credentialConfiguration.variableName}> environment variable`);

        if (rotate)
        {
            this._logger.warn(`Rotation not supported for <${this._credentialConfiguration.variableName}> environment variable credential`);
        }

        const secret = process.env[this._credentialConfiguration.variableName];

        if (!secret)
        {
            throw new Error(`Environment variable <${this._credentialConfiguration.variableName}> not set`);
        }

        return secret;
    }
}