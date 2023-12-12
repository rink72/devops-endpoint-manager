import { IProjectConfiguration } from "./iprojectconfiguration";


export interface IProjectConfigurationReader
{
    readConfiguration(): Promise<IProjectConfiguration[]>;
}
