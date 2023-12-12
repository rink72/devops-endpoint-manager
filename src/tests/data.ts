export const endpointsFileDataMock = `
endpoints:
- name: my-mock-azure-oidc-sve
  type: Azure
  tenantId: tenant-id
  identity:
    type: ServicePrincipal
    clientId: client-id
  scope: 
    type: Subscription
    id: subscription-id
    name: subscription-name
  credential:
    type: OIDC

- name: my-mock-azure-key-sve
  type: Azure
  tenantId: tenant-id
  identity:
    type: ServicePrincipal
    clientId: client-id
  scope: 
    type: Subscription
    id: subscription-id
    name: subscription-name
  credential:
    type: Key
    clientId: my-key-client-id
    daysValid: 7

- name: my-mock-shared-sve
  type: Shared
  sourceProject: my-mock-project

- name: my-mock-sonarcloud-sve
  type: SonarCloud
  credential:
    type: EnvironmentVariable
    variableName: MY_MOCK_VARIABLE_NAME

- name: my-mock-snyk-sve
  type: Snyk
  credential:
    type: KeyVault
    keyVault: my-mock-snyk-keyvault
    secretName: my-mock-synk-secret-name
`

export const projectsFileDataMock = `
projects:
- name: my-project-one
  removeObsoleteEndpoints: true
  endpoints:
  - name: my-endpoint-one
  - name: my-endpoint-two
  - name: my-endpoint-three

- name: my-project-two
  removeObsoleteEndpoints: false
  endpoints:
  - name: my-endpoint-one
  - name: my-endpoint-four
`