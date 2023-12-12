import { IAppConfig } from "../../appconfig/iappconfig"
import { ILogger } from "../../logger/ilogger"
import { EndpointConfigurationReader } from "../endpointconfigurationreader/endpointconfigurationreader"
import { IEndpointConfigurationReader } from "../endpointconfigurationreader/models/iendpointconfigurationreader"
import { IProjectConfigurationReader } from "../projectconfigurationreader/models/iprojectconfigurationreader"
import { ProjectConfigurationReader } from "../projectconfigurationreader/projectconfigurationreader"

export interface IReaderProps
{
    appConfig: IAppConfig
    logger: ILogger
}

export class ReaderFactory
{
    public static createEndpointConfigurationReader(props: IReaderProps): IEndpointConfigurationReader
    {
        props.logger.debug(`Creating endpoint configuration reader`);

        return new EndpointConfigurationReader(props)
    }

    public static createProjectConfigurationReader(props: IReaderProps): IProjectConfigurationReader
    {
        props.logger.debug(`Creating project configuration reader`);

        return new ProjectConfigurationReader(props)
    }
}