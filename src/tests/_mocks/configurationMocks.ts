/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICredential } from "../../credentials/icredential";
import { OidcCredential } from "../../credentials/oidccredential";
import { SpnKeyCredential } from "../../credentials/spnkeycredential";
import { AzureEndpointScope, AzureIdentityType, EndpointType, IAzureEndpointConfiguration } from "../../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { EndpointCredentialType, IEndpointEnvironmentVariableCredentialConfiguration, IEndpointOidcCredentialConfiguration, IEndpointSpnKeyCredentialConfiguration } from "../../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";

export const spnCredentialConfigurationMock: IEndpointSpnKeyCredentialConfiguration = {
    daysValid: 3,
    type: EndpointCredentialType.SpnKey
}

export const environmentVariableCredentialConfigurationMock: IEndpointEnvironmentVariableCredentialConfiguration = {
    type: EndpointCredentialType.EnvironmentVariable,
    variableName: "TEST_VARIABLE"
}

export const oidcCredentialConfigurationMock: IEndpointOidcCredentialConfiguration = {
    type: EndpointCredentialType.OIDC
}

export const azureDefaultEndpointConfigurationMock: IAzureEndpointConfiguration = {
    name: 'TestEndpoint',
    type: EndpointType.Azure,
    credential: environmentVariableCredentialConfigurationMock,
    identity: {
        clientId: 'client-id',
        type: AzureIdentityType.ServicePrincipal
    },
    scope: {
        id: 'subscription-id',
        name: 'subscription-name',
        type: AzureEndpointScope.Subscription
    },
    tenantId: 'tenant-id'
}

export const azureOidcEndpointConfigurationMock: IAzureEndpointConfiguration = {
    name: 'TestEndpoint',
    type: EndpointType.Azure,
    credential: oidcCredentialConfigurationMock,
    identity: {
        clientId: 'client-id',
        type: AzureIdentityType.ServicePrincipal
    },
    scope: {
        id: 'subscription-id',
        name: 'subscription-name',
        type: AzureEndpointScope.Subscription
    },
    tenantId: 'tenant-id'
}

export const azureSpnKeyEndpointConfigurationMock: IAzureEndpointConfiguration = {
    name: 'TestEndpoint',
    type: EndpointType.Azure,
    credential: spnCredentialConfigurationMock,
    identity: {
        clientId: 'client-id',
        type: AzureIdentityType.ServicePrincipal
    },
    scope: {
        id: 'subscription-id',
        name: 'subscription-name',
        type: AzureEndpointScope.Subscription
    },
    tenantId: 'tenant-id'
}

export const credentialMock: jest.Mocked<ICredential> = new Proxy({}, {
    get: (target: any, prop: string) =>
    {
        if (!target[prop])
        {
            target[prop] = jest.fn();
        }
        return target[prop];
    },
}) as jest.Mocked<ICredential>;

export const oidcCredentialMock: jest.Mocked<OidcCredential> = new Proxy({}, {
    get: (target: any, prop: string) =>
    {
        if (!target[prop])
        {
            target[prop] = jest.fn();
        }
        return target[prop];
    },
}) as jest.Mocked<OidcCredential>;

export const spnKeyCredentialMock: jest.Mocked<SpnKeyCredential> = new Proxy({}, {
    get: (target: any, prop: string) =>
    {
        if (!target[prop])
        {
            target[prop] = jest.fn();
        }
        return target[prop];
    },
}) as jest.Mocked<SpnKeyCredential>;