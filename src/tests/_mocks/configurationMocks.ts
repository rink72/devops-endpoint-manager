/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICredential } from "../../credentials/icredential";
import { AzureEndpointScope, AzureIdentityType, EndpointType, IAzureEndpointConfiguration } from "../../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { EndpointCredentialType, IEndpointEnvironmentVariableCredentialConfiguration, IEndpointSpnKeyCredentialConfiguration } from "../../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";

export const spnCredentialConfigurationMock: IEndpointSpnKeyCredentialConfiguration = {
    daysValid: 3,
    type: EndpointCredentialType.SpnKey
}

export const environmentVariableCredentialConfigurationMock: IEndpointEnvironmentVariableCredentialConfiguration = {
    type: EndpointCredentialType.EnvironmentVariable,
    variableName: "TEST_VARIABLE"
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