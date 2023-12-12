# DevEnd - Azure DevOps Service Endpoint Manager

DevEnd is a command-line interface (CLI) tool designed to manage Azure DevOps Service Endpoints. It allows for efficient deployment and configuration of service endpoints in Azure DevOps environments.

## Features

- Deploy and manage Azure DevOps Service Endpoints
- Remove obsolete credentials
- Customizable logging levels
- Configurable through command-line options or environment variables

## Supported Endpoint Types

DevEnd supports a variety of endpoint types for Azure DevOps, offering flexible configurations to meet different needs:

- **Azure RM (Resource Manager)**:
  - Using service principal key authentication
  - Using OpenID Connect (OIDC) authentication
- **Snyk**: Integration with Snyk for vulnerability management
- **SonarCloud**: Configuration for SonarCloud code quality checks
- **Sharing Existing Endpoints**: Capability to share existing service endpoints across different Azure DevOps projects

## Supported Credential Sources

DevEnd supports various credential sources, providing flexibility for different endpoint types:

- **KeyVault**:

  - Available for all endpoint types
  - Secure storage and retrieval of credentials from Azure KeyVault

- **Environment Variable**:

  - Applicable to all endpoint types
  - Utilize environment variables for credentials, enabling easy integration with CI/CD pipelines

- **OIDC (OpenID Connect)**:

  - Exclusive to Azure RM endpoints
  - Provides secure authentication using OIDC

- **Service Principal Key**:
  - Planned implementation for Azure RM endpoints
  - Enables authentication using Azure service principal keys
  - Supports rotation of credentials

These credential sources enhance security and ease of configuration across various environments.

## Usage

DevEnd is available as an npm package. You can run it directly using npx without needing to install it globally:

```bash
devend deploy [options]
-t, --azure-devops-token <token>: Set the Azure DevOps token. Alternatively, use DEVEND_AZDEV_TOKEN environment variable.
-l, --logging-level <level>: Set the logging level (info, verbose, debug). Can also be set with DEVEND_LOGGING_LEVEL.
-u, --azure-devops-url <url>: Set the Azure DevOps URL. Use DEVEND_AZDEV_URL as an alternative.
-p, --projects-configuration-path <path>: Specify the path to the projects configuration file. Can also be set with DEVEND_PROJECTS_CONFIGURATION_PATH. Defaults to ./projects.yml
-e, --endpoints-configuration-path <path>: Specify the path to the endpoints configuration file. Alternatively, use DEVEND_ENDPOINTS_CONFIGURATION_PATH. Defaults to /endpoints.yml
```

> Refer to [Runtime configuration guide](./docs/usage.md) for more details

## Example Usages

### Simplest Usage

Run the orchestrator using just the Azure DevOps URL and token:

```bash
npx devend deploy --azure-devops-url "https://dev.azure.com/your_organization" --azure-devops-token "your_token"
```

### Usage with Azure Resources

When using Azure KeyVaults, Service Principal Keys or configuring OIDC authentication, you will need to authenticate using `az login` before running DevEnd.

```bash
az login

npx devend deploy --azure-devops-url "https://dev.azure.com/your_organization" --azure-devops-token "your_token"
```

## Configuration

Please refer to the [Endpoints configuration guide](./docs/endpoints.md) and [Projects configuration guide](./docs/projects.md) for details on how to setup your configuration files.

## Contributing

Contributions to DevEnd are welcome. Please refer to the contributing guidelines for more information.

## License

This project is licensed under the GNU General Public License version 3 (GPL-3.0). For more details, see the [LICENSE](LICENSE) file in the repository.

## Author

Sam Beardman
