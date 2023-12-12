/* eslint-disable indent */
import { ICredential } from "../credentials/icredential";
import { ILogger } from "../logger/ilogger";
import { AzureEndpointScope, IAzureEndpointConfiguration } from "../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { EndpointCredentialType } from "../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";
import { IAzDevServiceEndpoint, IAzDevServiceEndpointProjectReferences } from "../clients/azdevclient/models/iazdevserviceendpoint";
import { IAzDevClient } from "../clients/azdevclient/iazdevclient";
import { EndpointBase } from "./endpointbase";
import { IAzureClient } from "../clients/azureclient/iazureclient";
import { OidcCredential } from "../credentials/oidccredential";

export interface IAzureEndpointProps
{
    logger: ILogger
    azdevClient: IAzDevClient
    endpointConfiguration: IAzureEndpointConfiguration
    credential: ICredential
    azureClient?: IAzureClient
}

export class AzureEndpoint extends EndpointBase
{
    private readonly _credential: ICredential

    constructor(props: IAzureEndpointProps)
    {
        super({
            azdevClient: props.azdevClient,
            endpointConfiguration: props.endpointConfiguration,
            logger: props.logger,
            validCredentialTypes: [
                EndpointCredentialType.EnvironmentVariable,
                EndpointCredentialType.KeyVault,
                EndpointCredentialType.OIDC
            ]
        });

        this._credential = props.credential;

        this.validateCredentialType(props.endpointConfiguration.credential);
    }

    public async createEndpoint(rotateCredential: boolean, projectId: string): Promise<IAzDevServiceEndpoint>
    {
        this._logger.debug(`Creating endpoint <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type})`);

        const endpointConfiguration = this._endpointConfiguration as IAzureEndpointConfiguration;
        const existingEndpoint = await this.getExistingEndpoint(projectId);
        const endpointObject = await this.createEndpointObject(rotateCredential, projectId, existingEndpoint);

        let serviceEndpoint: IAzDevServiceEndpoint;

        if (existingEndpoint)
        {
            this._logger.verbose(`Updating <${endpointConfiguration.name}> (${endpointConfiguration.type}) endpoint`);

            serviceEndpoint = await this._azdevClient.updateServiceEndpoint(endpointObject);
        }
        else
        {
            this._logger.verbose(`Creating <${endpointConfiguration.name}> (${endpointConfiguration.type}) endpoint`);

            serviceEndpoint = await this._azdevClient.createServiceEndpoint(endpointObject);
        }

        if (endpointConfiguration.credential.type === EndpointCredentialType.OIDC)
        {
            this._logger.verbose(`Creating federated credential for <${endpointConfiguration.name}> endpoint`);

            const oidcCredential = this._credential as OidcCredential;

            if (!serviceEndpoint.authorization?.parameters?.workloadIdentityFederationSubject
                || !serviceEndpoint.authorization?.parameters?.workloadIdentityFederationIssuer)
            {
                throw new Error(`Missing workload identity federation parameters for <${endpointConfiguration.name}> endpoint`);
            }

            await oidcCredential.createFederatedCredential({
                name: projectId,
                servicePrincipalClientId: endpointConfiguration.identity.clientId,
                subject: serviceEndpoint.authorization.parameters.workloadIdentityFederationSubject,
                issuer: serviceEndpoint.authorization.parameters.workloadIdentityFederationIssuer
            });
        }

        return serviceEndpoint;
    }

    protected async createEndpointObject(rotateCredential: boolean, projectId: string, existingEndpoint?: IAzDevServiceEndpoint): Promise<IAzDevServiceEndpoint>
    {
        this._logger.debug(`Creating endpoint <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type}) configuration object`);

        const endpointConfiguration = this._endpointConfiguration as IAzureEndpointConfiguration;
        const projectReferences = this.createProjectReferences(projectId, existingEndpoint);

        if (endpointConfiguration.credential.type === EndpointCredentialType.OIDC)
        {
            return this.createOidcEndpointObject(endpointConfiguration, projectReferences, existingEndpoint);
        }

        const credential = await this._credential.getCredential(rotateCredential);

        return this.createSpnKeyEndpointObject(endpointConfiguration, credential, projectReferences, existingEndpoint);
    }

    private createOidcEndpointObject(endpointConfiguration: IAzureEndpointConfiguration, projectReferences: IAzDevServiceEndpointProjectReferences[], existingEndpoint?: IAzDevServiceEndpoint): IAzDevServiceEndpoint
    {
        const endpointData = this.createEndpointDataObject(endpointConfiguration);

        const serviceEndpoint: IAzDevServiceEndpoint = {
            id: existingEndpoint?.id,
            name: endpointConfiguration.name,
            type: "azurerm",
            url: "https://management.azure.com/",
            authorization: {
                parameters: {
                    serviceprincipalid: endpointConfiguration.identity.clientId,
                    tenantid: endpointConfiguration.tenantId
                },
                scheme: "WorkloadIdentityFederation"
            },
            data: endpointData,
            serviceEndpointProjectReferences: projectReferences
        }

        return serviceEndpoint;
    }

    private createSpnKeyEndpointObject(endpointConfiguration: IAzureEndpointConfiguration, credentialString: string, projectReferences: IAzDevServiceEndpointProjectReferences[], existingEndpoint?: IAzDevServiceEndpoint): IAzDevServiceEndpoint
    {
        const endpointData = this.createEndpointDataObject(endpointConfiguration);

        const serviceEndpoint: IAzDevServiceEndpoint = {
            id: existingEndpoint?.id,
            name: endpointConfiguration.name,
            type: "azurerm",
            url: "https://management.azure.com/",
            authorization: {
                parameters: {
                    authenticationType: "spnKey",
                    serviceprincipalid: endpointConfiguration.identity.clientId,
                    serviceprincipalkey: credentialString,
                    tenantid: endpointConfiguration.tenantId
                },
                scheme: "ServicePrincipal"
            },
            data: endpointData,
            serviceEndpointProjectReferences: projectReferences
        }

        return serviceEndpoint;
    }

    private createEndpointDataObject(endpointConfiguration: IAzureEndpointConfiguration): { [key: string]: string }
    {
        switch (endpointConfiguration.scope.type)
        {
            case AzureEndpointScope.Subscription:
                return {
                    environment: "AzureCloud",
                    scopeLevel: "Subscription",
                    subscriptionId: endpointConfiguration.scope.id,
                    subscriptionName: endpointConfiguration.scope.name,
                    creationMode: "Manual"
                }
            case AzureEndpointScope.ManagementGroup:
                return {
                    environment: "AzureCloud",
                    scopeLevel: "ManagementGroup",
                    managementGroupId: endpointConfiguration.scope.id,
                    managementGroupName: endpointConfiguration.scope.name,
                    creationMode: "Manual"
                }
            default:
                throw new Error(`Unknown Azure endpoint scope type: ${endpointConfiguration.scope.type}`);
        }
    }
}