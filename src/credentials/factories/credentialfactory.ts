/* eslint-disable indent */
import { KeyVaultClientFactory } from "../../clients/keyvaultclient/factories/keyvaultclientfactory";
import { ILogger } from "../../logger/ilogger";
import { EndpointCredentialType, IEndpointCredentialConfiguration } from "../../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";
import { EnvironmentVariableCredential } from "../environmentvariablecredential";
import { ICredential } from "../icredential";
import { ICredentialFactory } from "./icredentialfactory";
import { KeyVaultCredential } from "../keyvaultcredential";
import { OidcCredential } from "../oidccredential";
import { AzureClientFactory } from "../../clients/azureclient/factories/azureclientfactory";
import { SpnKeyCredential } from "../spnkeycredential";

export interface ICredentialFactoryProps
{
    logger: ILogger
}

export class CredentialFactory implements ICredentialFactory
{
    private readonly _logger: ILogger

    constructor(props: ICredentialFactoryProps)
    {
        this._logger = props.logger;
    }

    public async createCredential(credential: IEndpointCredentialConfiguration): Promise<ICredential>
    {
        switch (credential.type)
        {
            case EndpointCredentialType.EnvironmentVariable:
                return new EnvironmentVariableCredential({
                    logger: this._logger,
                    credentialConfiguration: credential
                });

            case EndpointCredentialType.OIDC:
                {
                    const azureClient = await AzureClientFactory.createClient({ logger: this._logger });

                    return new OidcCredential({
                        logger: this._logger,
                        azureClient: azureClient,
                        credentialConfiguration: credential
                    });
                }

            case EndpointCredentialType.KeyVault:
                {
                    const keyVaultClient = await KeyVaultClientFactory.createClient({ logger: this._logger, keyVaultName: credential.keyVault });

                    return new KeyVaultCredential({
                        logger: this._logger,
                        keyVaultClient: keyVaultClient,
                        credentialConfiguration: credential

                    })
                }

            case EndpointCredentialType.SpnKey:
                {
                    const azureClient = await AzureClientFactory.createClient({ logger: this._logger });

                    return new SpnKeyCredential({
                        logger: this._logger,
                        azureClient: azureClient,
                        credentialConfiguration: credential
                    })
                }
        }
    }
}