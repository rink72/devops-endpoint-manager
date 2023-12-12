# Runtime Configuration Guide for DevEnd CLI

The DevEnd CLI provides various configuration options that can be set via command-line parameters or corresponding environment variables.

## CLI Parameters

Use the following command with options to configure the CLI at runtime:

```bash
npx devend deploy [options]
```

Options:

- `-t, --azure-devops-token <token>`: Specifies the Azure DevOps personal access token.
- `-l, --logging-level <level>`: Sets the logging level (`info`, `verbose`, `debug`).
- `-u, --azure-devops-url <url>`: URL of the Azure DevOps organization.
- `-p, --projects-configuration-path <path>`: Path to the projects configuration file.
- `-e, --endpoints-configuration-path <path>`: Path to the endpoints configuration file.

## Environment Variables

Alternatively, these configurations can be set using environment variables:

- `DEVEND_AZDEV_TOKEN`: Azure DevOps personal access token.
- `DEVEND_LOGGING_LEVEL`: Logging level (`info`, `verbose`, `debug`).
- `DEVEND_AZDEV_URL`: URL of the Azure DevOps organization.
- `DEVEND_PROJECTS_CONFIGURATION_PATH`: Path to the projects configuration file.
- `DEVEND_ENDPOINTS_CONFIGURATION_PATH`: Path to the endpoints configuration file.

The CLI parameters take precedence over the environment variables if both are set.
