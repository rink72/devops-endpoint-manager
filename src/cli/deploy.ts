import { IRunOptions } from "./cli";
import { AppConfig, AzDevClient, CredentialFactory, EndpointFactory, IAppConfigProps, IReaderProps, ProjectOrchestrator, ReaderFactory, WinstonLogger, getAzureDevOpsConnection } from "../main"

export const deploy = async (options: IRunOptions) =>
{
    const configProps: IAppConfigProps = {
        azDevToken: options.azureDevopsToken,
        azDevUrl: options.azureDevopsUrl,
        loggingLevel: options.loggingLevel,
        projectsConfigurationPath: options.projectsConfigurationPath,
        endpointsConfigurationPath: options.endpointsConfigurationPath
    }

    const appConfig = new AppConfig(configProps);
    const logger = new WinstonLogger(appConfig.getLoggingLevel());

    try
    {
        console.log(`Running Azure DevOps Service Endpoint Orchestrator`);

        const azdevConnection = getAzureDevOpsConnection(appConfig, logger);
        const azdevClient = new AzDevClient({ logger: logger, azdevConnection: azdevConnection });

        const readerProps: IReaderProps = {
            appConfig: appConfig,
            logger: logger
        }

        const endpointConfigReader = ReaderFactory.createEndpointConfigurationReader(readerProps);
        const projectConfigReader = ReaderFactory.createProjectConfigurationReader(readerProps);
        const credentialFactory = new CredentialFactory({ logger: logger });

        const endpointFactory = new EndpointFactory({
            logger: logger,
            credentialFactory: credentialFactory,
            azDevClient: azdevClient
        });

        const projectsConfiguration = await projectConfigReader.readConfiguration();
        const endpointsConfiguration = await endpointConfigReader.readConfiguration();

        for (const project of projectsConfiguration)
        {
            const projectOrchestrator = new ProjectOrchestrator({
                azDevClient: azdevClient,
                endpointFactory: endpointFactory,
                endpointsConfiguration: endpointsConfiguration,
                logger: logger,
                projectConfiguration: project
            })

            await projectOrchestrator.run(false);
        }
    }
    catch (error)
    {
        logger.error(`${error}`);
        process.exit(1);
    }

}