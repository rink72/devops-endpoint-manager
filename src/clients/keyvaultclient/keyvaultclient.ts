import { SecretClient } from "@azure/keyvault-secrets";
import { ILogger } from "../../logger/ilogger";
import { IKeyVaultClient } from "./ikeyvaultclient";

export interface IKeyVaultClientProps
{
    logger: ILogger
    secretClient: SecretClient
}

export class KeyVaultClient implements IKeyVaultClient
{
    private readonly _logger: ILogger
    private readonly _secretClient: SecretClient

    constructor(props: IKeyVaultClientProps)
    {
        this._logger = props.logger;
        this._secretClient = props.secretClient;
    }

    public async getSecret(secretName: string): Promise<string | null>
    {
        this._logger.debug(`Retrieving <${secretName}> secret from <${this._secretClient.vaultUrl}> KeyVault`);

        const secret = await this._secretClient.getSecret(secretName);

        return secret.value ?? null;
    }
}