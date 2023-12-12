import { IEndpointConfiguration, ISharedEndpointConfiguration } from "./iendpointconfiguration";

export interface IEndpointConfigurationReader
{
    readConfiguration(): Promise<(IEndpointConfiguration | ISharedEndpointConfiguration)[]>
}