import { DefaultAzureCredential } from "@azure/identity";
import { IAzureClient } from "../iazureclient";
import { DefaultAzureAuthProvider } from "../../../providers/defaultazureauthprovider";
import { Client } from "@microsoft/microsoft-graph-client";
import { AzureClient } from "../azureclient";
import { ILogger } from "../../../logger/ilogger";

export interface IAzureClientFactoryProps
{
    logger: ILogger
}

export class AzureClientFactory
{
    static async createClient(props: IAzureClientFactoryProps): Promise<IAzureClient>
    {
        const tokenCredential = new DefaultAzureCredential();
        const authProvider = new DefaultAzureAuthProvider({ tokenCredential: tokenCredential });

        const graphToken = await authProvider.getGraphToken();
        const graphClient = Client.init({ authProvider: (done) => done(null, graphToken) })

        return new AzureClient({ logger: props.logger, graphClient: graphClient });
    }
}