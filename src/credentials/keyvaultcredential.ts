import { IKeyVaultClient } from "../clients/keyvaultclient/ikeyvaultclient"
import { ILogger } from "../logger/ilogger"
import { IEndpointKeyVaultCredentialConfiguration } from "../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration"
import { ICredential } from "./icredential"

export interface IKeyVaultCredentialProps
{
    logger: ILogger
    keyVaultClient: IKeyVaultClient
    credentialConfiguration: IEndpointKeyVaultCredentialConfiguration
}

export class KeyVaultCredential implements ICredential
{
    private readonly _logger: ILogger
    private readonly _keyVaultClient: IKeyVaultClient
    private readonly _credentialConfiguration: IEndpointKeyVaultCredentialConfiguration

    constructor(props: IKeyVaultCredentialProps)
    {
        this._logger = props.logger
        this._keyVaultClient = props.keyVaultClient
        this._credentialConfiguration = props.credentialConfiguration
    }

    public async getCredential(rotate: boolean): Promise<string>
    {
        this._logger.debug(`Retrieving <${this._credentialConfiguration.secretName}> secret from <${this._credentialConfiguration.keyVault}> KeyVault`);

        if (rotate)
        {
            this._logger.warn(`Rotation not supported for <${this._credentialConfiguration.secretName}> KeyVault credential`);
        }

        const secret = await this._keyVaultClient.getSecret(this._credentialConfiguration.secretName);

        if (!secret)
        {
            throw new Error(`Unable to retrieve <${this._credentialConfiguration.secretName}> secret from <${this._credentialConfiguration.keyVault}> KeyVault`);
        }

        return secret;
    }
}