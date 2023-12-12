import { DefaultAzureCredential } from "@azure/identity";
import { ILogger } from "../../../logger/ilogger";
import { IKeyVaultClient } from "../ikeyvaultclient";
import { SecretClient } from "@azure/keyvault-secrets";
import { KeyVaultClient } from "../keyvaultclient";

export interface IKeyVaultClientFactoryProps
{
    logger: ILogger
    keyVaultName: string
}

export class KeyVaultClientFactory
{
    static async createClient(props: IKeyVaultClientFactoryProps): Promise<IKeyVaultClient>
    {
        const tokenCredential = new DefaultAzureCredential();
        const keyVaultUrl = `https://${props.keyVaultName}.vault.azure.net`;

        const secretClient = new SecretClient(keyVaultUrl, tokenCredential);

        return new KeyVaultClient({ logger: props.logger, secretClient: secretClient });
    }
}