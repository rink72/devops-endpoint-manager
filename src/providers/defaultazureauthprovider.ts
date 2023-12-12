import { TokenCredential } from "@azure/identity";
import { IAzureAuthProvider } from "./iazureauthprovider";

export interface IDefaultAzureAuthProviderProps
{
    tokenCredential: TokenCredential
}

export class DefaultAzureAuthProvider implements IAzureAuthProvider
{
    private readonly _tokenCredential: TokenCredential

    constructor(props: IDefaultAzureAuthProviderProps)
    {
        this._tokenCredential = props.tokenCredential;
    }

    public async getManagementToken(): Promise<string>
    {
        const token = await this._tokenCredential.getToken("https://management.azure.com/.default");

        if (token === null)
        {
            throw new Error("Failed to retrieve management token");
        }

        return token.token;
    }

    public async getGraphToken(): Promise<string>
    {
        const token = await this._tokenCredential.getToken("https://graph.microsoft.com/.default");

        if (token === null)
        {
            throw new Error("Failed to retrieve graph token");
        }

        return token.token;
    }
}