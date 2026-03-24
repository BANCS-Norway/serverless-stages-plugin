# Contributing to @bancs/serverless-stages-plugin

Thank you for taking the time to contribute!

**Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing. By participating, you agree to abide by its terms.**

## Table of contents

- [Getting started](#getting-started)
- [Running tests](#running-tests)
- [Branch naming](#branch-naming)
- [Commit messages](#commit-messages)
- [Opening a pull request](#opening-a-pull-request)
- [How releases work](#how-releases-work)

---

## Getting started

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/serverless-stages-plugin.git
   cd serverless-stages-plugin
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the TypeScript source:

   ```bash
   npm run build
   ```

## Running tests

```bash
npm test
```

All tests must pass before opening a PR.

## Branch naming

Use the format `{type}/{issue-number}-{short-description}`:

```text
fix/12-stage-fallback
feat/15-warn-hook
docs/8-usage-examples
ci/9-update-node-version
```

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/).
**Each PR must contain exactly one commit** — squash your work before opening the PR.

### Types that trigger a release

| Type | Release | When to use |
|------|---------|-------------|
| `fix:` | patch | A bug is corrected — consumers were getting wrong behaviour |
| `feat:` | minor | A new capability is added that consumers can use |
| `feat!:` / `BREAKING CHANGE:` footer | major | Existing behaviour changes in a way requiring consumers to update |

### Types that do not trigger a release

| Type | When to use |
|------|-------------|
| `docs:` | README, CONTRIBUTING, comments, or any human-readable text |
| `test:` | Adding or fixing tests only — no production code change |
| `refactor:` | Code restructured but behaviour is identical |
| `perf:` | Performance improvement with no behaviour change |
| `ci:` | GitHub Actions workflows, CI config, release tooling |
| `chore:` | Dependency bumps, tooling config, repo housekeeping |

### Examples

```text
fix: fall back to provider.stage when --stage is not provided (closes #12)
feat: add warn hook before deploy (closes #15)
docs: add usage examples to README (closes #8)
ci: update Node.js version to 24 (closes #9)
```

## Opening a pull request

1. Make sure your branch is up to date with `main`.
2. Squash all commits into **one semantic commit** before opening the PR.
3. Use the PR template — fill in what the PR does, why, and the issue it closes.
4. Ensure the PR title matches your commit message (it becomes the squash-merge commit message).

## Recognising contributors

This project uses the [all-contributors](https://allcontributors.org) bot to credit all types of contribution — not just code.

After a PR is merged, a maintainer can comment on it:

```text
@all-contributors please add @username for code, doc
```

The bot will open a PR updating the contributors table in the README. Contribution types include `code`, `doc`, `bug`, `test`, `ci`, `review`, and [many more](https://allcontributors.org/docs/en/emoji-key).

Bot PRs use `docs:` prefixed commit messages and `[skip ci]` so they do not trigger a new release.

## How releases work

Releases are automated via [semantic-release](https://semantic-release.gitbook.io/).
When a PR is merged to `main`, semantic-release analyses the commit message and:

- `fix:` → publishes a **patch** release to npm
- `feat:` → publishes a **minor** release to npm
- `BREAKING CHANGE:` → publishes a **major** release to npm
- All other types → no release

A `CHANGELOG.md` and GitHub Release are generated automatically.
You do not need to manually bump `package.json` or create git tags.
