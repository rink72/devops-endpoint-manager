/* eslint-disable indent */
import * as yup from 'yup';
import { AzureEndpointScope, AzureIdentityType, EndpointType } from '../models/iendpointconfiguration';
import { EndpointCredentialType } from '../models/iendpointcredentialconfiguration';

const environmentVariableCredentialSchema = yup.object({
    type: yup.string().oneOf([EndpointCredentialType.EnvironmentVariable]).required(),
    variableName: yup.string().required()
}).noUnknown().strict();

const oidcCredentialSchema = yup.object({
    type: yup.string().oneOf([EndpointCredentialType.OIDC]).required(),
}).noUnknown().strict();

const keyVaultCredentialSchema = yup.object({
    type: yup.string().oneOf([EndpointCredentialType.KeyVault]).required(),
    keyVault: yup.string().required(),
    secretName: yup.string().required()
}).noUnknown().strict();

const spnKeyCredentialSchema = yup.object({
    type: yup.string().oneOf([EndpointCredentialType.SpnKey]).required(),
    daysValid: yup.number().default(30)
}).noUnknown().strict();

const credentialSchema = yup.lazy(value =>
{
    if (!value.type)
    {
        throw new Error(`Credential type is required`);
    }

    switch (value.type)
    {
        case EndpointCredentialType.EnvironmentVariable:
            return environmentVariableCredentialSchema;
        case EndpointCredentialType.OIDC:
            return oidcCredentialSchema;
        case EndpointCredentialType.KeyVault:
            return keyVaultCredentialSchema;
        case EndpointCredentialType.SpnKey:
            return spnKeyCredentialSchema;
        default:
            throw new Error(`Unknown <${value.type}> credential type`);
    }
});

export const sharedEndpointConfigurationSchema = yup.object({
    name: yup.string().required(),
    type: yup.string().oneOf([EndpointType.Shared]).required(),
    sourceProject: yup.string().required()
}).noUnknown().strict();

export const azureEndpointScopeConfigurationSchema = yup.object({
    type: yup.string().oneOf([AzureEndpointScope.ManagementGroup, AzureEndpointScope.Subscription]).required(),
    id: yup.string().required(),
    name: yup.string().required()
}).noUnknown().strict();

export const azureIdentitySchema = yup.object({
    type: yup.string().oneOf([AzureIdentityType.ServicePrincipal]).required(),
    clientId: yup.string().required()
}).noUnknown().strict();

export const azureEndpointConfigurationSchema = yup.object({
    name: yup.string().required(),
    type: yup.string().oneOf([EndpointType.Azure]).required(),
    tenantId: yup.string().required(),
    identity: azureIdentitySchema.required(),
    scope: azureEndpointScopeConfigurationSchema.required(),
    credential: credentialSchema
}).noUnknown().strict();

export const sonarCloudEndpointConfigurationSchema = yup.object({
    name: yup.string().required(),
    type: yup.string().oneOf([EndpointType.SonarCloud]).required(),
    credential: credentialSchema
}).noUnknown().strict();

export const snykEndpointConfigurationSchema = yup.object({
    name: yup.string().required(),
    serverUrl: yup.string().default("https://snyk.io/").nonNullable(),
    type: yup.string().oneOf([EndpointType.Snyk]).required(),
    credential: credentialSchema
}).noUnknown().strict();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const endpointConfigurationSchema = yup.lazy((value: any) =>
{
    switch (value.type)
    {
        case EndpointType.Shared:
            return sharedEndpointConfigurationSchema;
        case EndpointType.Azure:
            return azureEndpointConfigurationSchema;
        case EndpointType.SonarCloud:
            return sonarCloudEndpointConfigurationSchema;
        case EndpointType.Snyk:
            return snykEndpointConfigurationSchema;
        default:
            throw new Error(`Unknown endpoint type: ${value.type}`);
    }
});
