# Project Configuration Guide

This configuration file defines settings for projects in DevEnd. Each project can have multiple service endpoints.

## Configuration Structure

### Example Configuration

```yaml
projects:
  - name: Project1
    removeObsoleteEndpoints: true
    endpoints:
      - name: azurerm-endpoint
      - name: snyk-endpoint

  - name: Project2
    removeObsoleteEndpoints: false
    endpoints:
      - name: sonarcloud-endpoint
      - name: shared-endpoint
```

### Fields Explanation

- `name`: The name of the project.
- `removeObsoleteEndpoints`: Boolean flag to remove endpoints not listed in the configuration (true or false).
- `endpoints`: A list of endpoint configurations.
  - `name`: Name of the endpoint, which should correspond to one defined in `endpoints.yml`.

## Usage

Configure each project with the necessary details and endpoints. Use `removeObsoleteEndpoints` to manage endpoint cleanup.
