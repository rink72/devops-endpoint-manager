# Endpoint Configuration Guide

## Endpoint Configuration

### Azure Endpoint

```yaml
- name: azure-endpoint-oidc
  type: Azure
  tenantId: your-tenant-id
  identity:
    type: ServicePrincipal
    clientId: your-client-id
  scope:
    type: Subscription
    id: your-subscription-id
    name: your-subscription-name
  credential: <CREDENTIAL_CONFIGURATION>
```

### Snyk Endpoint

```yaml
- name: snyk-endpoint
  serverUrl: https://snyk.io/
  type: Snyk
  credential: <CREDENTIAL_CONFIGURATION>
```

### SonarCloud Endpoint

```yaml
- name: sonarcloud-endpoint
  type: SonarCloud
  organization: your-organization
  credential: <CREDENTIAL_CONFIGURATION>
```

### Shared Endpoint

```yaml
- name: shared-endpoint
  type: Shared
  sourceProject: Project1
  credential: <CREDENTIAL_CONFIGURATION>
```

## Credential Configuration

### OIDC credential

> **Note:** This credential type is only supported for Azure endpoints.

```yaml
credential:
  type: OIDC
```

### KeyVault credential source

```yaml
credential:
  type: KeyVault
  keyvault: your-keyvault-name
  secretName: secret-name
```

### Environment variable source

```yaml
credential:
  type: EnvironmentVariable
  variableName: ENVIRONMENT_VARIABLE_NAME
```
