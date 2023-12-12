#!/usr/bin/env node

import { version } from '../package.json';
import { program } from 'commander';
import { deploy } from './deploy';

export interface IRunOptions
{
    loggingLevel?: string
    azureDevopsToken?: string
    azureDevopsUrl?: string
    projectsConfigurationPath?: string
    endpointsConfigurationPath?: string
}

program
    .name("devend")
    .description("CLI to manage Azure DevOps Service Endpoints")
    .version(version);

program
    .command('deploy')
    .description('Run the Azure DevOps Service Endpoint Orchestrator')
    .option('-t, --azure-devops-token <token>', 'Set the Azure DevOps token (DEVEND_AZDEV_TOKEN)')
    .option('-l, --logging-level <level>', 'Set the logging level (info, verbose, debug) (DEVEND_LOGGING_LEVEL)')
    .option('-u, --azure-devops-url <url>', 'Set the Azure DevOps URL (DEVEND_AZDEV_URL)')
    .option('-p, --projects-configuration-path <path>', 'Set the path to the projects configuration file (DEVEND_PROJECTS_CONFIGURATION_PATH)')
    .option('-e, --endpoints-configuration-path <path>', 'Set the path to the endpoints configuration file (DEVEND_ENDPOINTS_CONFIGURATION_PATH)')
    .action(async (options: IRunOptions) => await deploy(options));

program.parse(process.argv);
