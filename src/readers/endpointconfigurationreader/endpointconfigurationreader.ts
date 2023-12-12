import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';

import { ILogger } from "../../logger/ilogger";
import { IReaderProps } from "../factories/readerfactory";
import { IEndpointConfiguration, IEndpointConfigurationFile, ISharedEndpointConfiguration } from "./models/iendpointconfiguration"
import { IEndpointConfigurationReader } from "./models/iendpointconfigurationreader";
import { endpointConfigurationSchema } from './validation/endpointconfigurationschema';

export class EndpointConfigurationReader implements IEndpointConfigurationReader
{
    private readonly _configPath: string;
    private readonly _logger: ILogger;

    constructor(props: IReaderProps)
    {
        this._configPath = props.appConfig.getEndpointsConfigurationPath();
        this._logger = props.logger;
    }

    public async readConfiguration(): Promise<(IEndpointConfiguration | ISharedEndpointConfiguration)[]>
    {
        try
        {
            this._logger.debug(`Reading <${this._configPath}> endpoint configuration file`);

            const fileContents = await fs.readFile(this._configPath, "utf8");

            const config = yaml.load(fileContents) as IEndpointConfigurationFile;

            return await this.validateConfiguration(config);
        }
        catch (err)
        {
            const message = `Unable to read endpoint configuration file <${this._configPath}>`;

            this._logger.error(message);
            throw err;
        }
    }

    private async validateConfiguration(config: IEndpointConfigurationFile): Promise<IEndpointConfiguration[]>
    {
        try
        {
            this._logger.debug(`Validating <${this._configPath}> endpoint configuration file`);

            const validatedConfig = await Promise.all(config.endpoints.map(async (endpoint) =>
            {
                await endpointConfigurationSchema.validate(endpoint);

                return endpointConfigurationSchema.cast(endpoint, { stripUnknown: true });
            }));

            return validatedConfig;
        }
        catch (err)
        {
            const message = `Config file <${this._configPath}> is invalid - ${(err as Error).message}`;

            this._logger.error(message);
            throw err;
        }
    }
}