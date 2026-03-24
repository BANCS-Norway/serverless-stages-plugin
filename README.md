# @bancs/serverless-stages-plugin

[![npm version](https://img.shields.io/npm/v/@bancs/serverless-stages-plugin.svg)](https://www.npmjs.com/package/@bancs/serverless-stages-plugin)
[![CI](https://github.com/BANCS-Norway/serverless-stages-plugin/actions/workflows/pull_requests.yml/badge.svg)](https://github.com/BANCS-Norway/serverless-stages-plugin/actions/workflows/pull_requests.yml)
[![CodeQL](https://github.com/BANCS-Norway/serverless-stages-plugin/actions/workflows/codeql.yml/badge.svg)](https://github.com/BANCS-Norway/serverless-stages-plugin/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A [Serverless Framework](https://www.serverless.com/) plugin that restricts deployments to a configured list of allowed stages.

If you attempt to deploy to a stage that isn't in your `custom.stages` list, the deployment is aborted with a clear error message — preventing accidental deploys to the wrong environment.

## Installation

```bash
npm install --save-dev @bancs/serverless-stages-plugin
```

## Usage

Add the plugin to your `serverless.yml` and define the allowed stages in `custom.stages`:

```yaml
service: my-service

plugins:
  - @bancs/serverless-stages-plugin

custom:
  stages:
    - dev
    - staging
    - prod

provider:
  name: aws
  stage: ${opt:stage, 'dev'}
```

Now any deploy to a stage not in the list will fail immediately:

```shell
$ serverless deploy --stage qa
Error: 'qa' is not a valid deployment stage.
Add it to your serverless.yml's "custom.stages" section.
```

## Configuration

```yaml
custom:
  # Required. List the stages you allow deployments to.
  stages:
    - dev
    - staging
    - prod

  # A single string is also valid.
  # stages: prod
```

## How it works

The plugin hooks into `before:package:initialize` and `before:deploy:function:initialize`. On each hook it:

1. Reads the stage from `--stage` CLI option, falling back to `provider.stage`.
2. Reads the allowed stages from `custom.stages`.
3. Throws if `custom.stages` is missing or if the current stage is not in the list.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[MIT](./LICENSE)
