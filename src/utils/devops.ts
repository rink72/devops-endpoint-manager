import * as azdev from "azure-devops-node-api";
import { IAppConfig } from "../appconfig/iappconfig";
import { ILogger } from "../logger/ilogger";

export function getAzureDevOpsConnection(appConfig: IAppConfig, logger: ILogger): azdev.WebApi
{
    logger.debug(`Creating Azure DevOps client for <${appConfig.getAzDevUrl()}> organization`);

    const authHandler = azdev.getPersonalAccessTokenHandler(appConfig.getAzDevToken());
    const connection = new azdev.WebApi(appConfig.getAzDevUrl(), authHandler);

    return connection;
}