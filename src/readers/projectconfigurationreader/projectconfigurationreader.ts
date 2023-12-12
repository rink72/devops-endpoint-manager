import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';

import { IProjectConfigurationReader } from "./models/iprojectconfigurationreader";
import { IProjectConfiguration, IProjectConfigurationFile } from "./models/iprojectconfiguration"
import { ILogger } from "../../logger/ilogger";
import { IReaderProps } from "../factories/readerfactory";
import { projectConfigurationSchema } from './validation/projectconfigurationschema';

export class ProjectConfigurationReader implements IProjectConfigurationReader
{
    private readonly _configPath: string;
    private readonly _logger: ILogger;

    constructor(props: IReaderProps)
    {
        this._configPath = props.appConfig.getProjectsConfigurationPath();
        this._logger = props.logger;
    }

    public async readConfiguration(): Promise<IProjectConfiguration[]>
    {
        try
        {
            this._logger.debug(`Reading <${this._configPath}> project configuration file`);

            const fileContents = await fs.readFile(this._configPath, "utf8");

            const config = yaml.load(fileContents) as IProjectConfigurationFile;

            return await this.validateConfiguration(config);
        }
        catch (err)
        {
            const message = `Unable to read project configuration file <${this._configPath}>`;

            this._logger.error(message);
            throw err;
        }
    }

    private async validateConfiguration(config: IProjectConfigurationFile): Promise<IProjectConfiguration[]>
    {
        try
        {
            this._logger.debug(`Validating <${this._configPath}> project configuration file`);

            const validatedConfig = await Promise.all(config.projects.map(async (project) =>
            {
                await projectConfigurationSchema.validate(project);

                return projectConfigurationSchema.cast(project, { stripUnknown: true });
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