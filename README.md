# Projects

![](https://assets.projects.lp-i.org/projects/organization/logo/d5ddb4a6-7eac-4178-9813-52b3c0ea7fbe2eaa6790-9cdd-443a-98af-bb47abd276_uv0HCns.medium.png?se=2023-10-03T14%3A01%3A34Z&sp=r&sv=2022-11-02&sr=b&sig=X/vk1QhXw8Wat1jrIBl9BphWooYlyU%2BtHoh7Th0BIMI%3D)



An annuary to display and manage projects related to the UN sustainable goals.
This is the source running the frontend for the website [projects.directory](https://projects.directory)

> Share your projects to increase impact.
> Fill your profile with your skills and goals
> Use the Projects platform to showcase your projects,
> facilitate synergies and foster collaboration for common good.

## Team tools

-   [Slack](https://learningplane-9lc4300.slack.com)
-   [Sprint board](https://cri-paris.atlassian.net/jira/software/projects/PROJ/boards/1)

## Getting started

Ask the team for an administrator or user account.

Create a .env file from [.env.example](.env.example):

```bash
cp .env.example .env
```

Install app dependencies with [yarn](https://yarnpkg.com/) :

```bash
yarn install --pure-lockfile
```

Serve the app on [https://localhost:8080](https://localhost:8080) for development:

```bash
yarn serve
```

If you need a production build :

```bash
yarn build
```

## Contributing

We use a mono-branch flow:
Create a feature branch from main branch, work on it and push it.
Create a pull request and ask for a code review before integrating your changes in main branch.

[Husky](https://github.com/typicode/husky) has been set up to run the linter on staged files to ensure a coherent codebase before committing anything in a new branch.

[Github CI](https://docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration) checks that all unit tests are passing and that the app builds without errors.

## End-to-end testing

For running test with open pages, add --headed after test commands.

Running all tests :

```bash
yarn test:play
```

Running one test :

```bash
yarn test:play <folder>
```

Running test with specific browser:

```bash
yarn test:play:<browser> <folder>
```

browser options : chrome, edge, mobilesafari, mobilechrome, webkit, firefox, chromium.

Running Codegen :

```bash
yarn test:gen
```

## Unit testing

[Vitest](https://vitest.dev/) is used to test store modules, components and functions.
Testing is still quite new in our workflow, so if you find yourself working on a component that does not have any test consider adding one.

Run all unit tests:

```bash
yarn test:unit
```

## Internationalization

We use [vue-i18n](https://kazupon.github.io/vue-i18n/) which exposes a globally available **$t** function to manage our locales : fr - en

## Vue Style Guide

We should refer in most of case to the official [vue style guide](https://vuejs.org/style-guide/)
and [js clean code](https://github.com/ryanmcdermott/clean-code-javascript)

We use the strongly recommended rules from vue style guide and a few other ones : [eslint.rc.js](.eslintrc.js)

## Typescript

[Typescript](https://www.typescriptlang.org/) is still not used in components, for the moment we just benefit from type safety in most of the files consumed by the components. The types and interfaces are kept in the [models](src/models) folder.

## Backend Endpoints and Schemas

[Swagger doc](https://api.projects.k8s.lp-i.dev/api/schema/swagger-ui)

## Environments

-   development: https://cri.projects.k8s.lp-i.dev/
-   staging (a.k.a. pre-prod): https://cri.projects.k8s.lp-i.xyz/ and the meta portal https://projects.k8s.lp-i.xyz
-   production: the meta-portal https://projects.directory/, LPI portal https://projects.learningplanetinstitute.org/ and many more...

> The development environment is built on each push on the branch `main`, staging on each push of an `auto_staging` tag on main branch and the production on by pushsing a semver tag (i.e. `v1.2.3`) on the main branch.

## stack

this project depends on a few others, please refer to them for further documentation:

- a backend [project-backend](https://github.com/CyberCRI/projects-backend)
- a websocket server [projects-ws-hocuspocus](https://github.com/CyberCRI/projects-ws-hocuspocus)

will also provide a fullstack repository : [projects-fullstack](https://github.com/CyberCRI/projects-fullstack)