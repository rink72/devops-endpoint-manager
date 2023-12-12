import { IEndpointCredentialConfiguration } from "../../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";
import { ICredential } from "../icredential";

export interface ICredentialFactory
{
    createCredential(credentialConfiguration: IEndpointCredentialConfiguration): Promise<ICredential>
}