import { IEndpointConfiguration } from "../../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { IEndpoint } from "../iendpoint";

export interface IEndpointFactory
{
    createEndpoint(endpointConfiguration: IEndpointConfiguration): Promise<IEndpoint>
}