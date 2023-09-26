# Projects

![](public/logo-readme.png?raw=true)

An annuary to display and manage projects related to the UN sustainable goals.
This is the source running the frontend for the website [projects.directory](https://projects.directory)

> Share your projects to increase impact.
> Use the Projects platform to showcase your projects,
> facilitate synergies and foster collaboration for common good.

## Team tools

-   [Slack](https://learningplane-9lc4300.slack.com)
-   [Sprint board](https://github.com/orgs/CyberCRI/projects/3)

## Getting started

Ask the team for an administrator or user account.

Create a .env file from [.env.example](.env.example):

```bash
cp .env.example .env
```

Install app dependencies with [yarn](https://yarnpkg.com/) :

```bash
yarn
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

We use [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/):
Create a feature branch from develop branch, work on it and push it.
Create a pull request and ask for a code review before integrating your changes in develop branch.

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

[Jest](https://jestjs.io/) is used to test store modules, components and functions.
Testing is still quite new in our workflow, so if you find yourself working on a component that does not have any test consider adding one.

Run all unit tests:

```bash
yarn test:unit
```

## Internationalization

We use [vue-i18n](https://kazupon.github.io/vue-i18n/) which exposes a globally available **$t** function to manage our locales : fr - en

Consider using Vue ui localization tab :

```bash
vue ui
```

## Vue Style Guide

We should refer in most of case to the official [vue style guide](https://vuejs.org/v2/style-guide/)
and [js clean code](https://github.com/ryanmcdermott/clean-code-javascript)

We use the strongly recommended rules from vue style guide and a few other ones : [eslint.rc.js](.eslintrc.js)

## Typescript

[Typescript](https://www.typescriptlang.org/) is still not used in components, for the moment we just benefit from type safety in most of the files consumed by the components. The types and interfaces are kept in the [models](src/models) folder.

## Backend Endpoints and Schemas

[Swagger doc](https://api.projects.k8s.lp-i.dev/api/schema/swagger-ui)

## Environments

-   development: https://cri.projects.k8s.lp-i.dev/
-   staging (a.k.a. pre-prod): https://stag.projects.cri-paris.org/ and the meta portal https://stag.projects.directory/
-   production: the meta-portal https://projects.directory/, CRI portal https://projects.cri-paris.org/ and many more...

> The development environment is built on each push on the branch `develop`, staging on each push on `staging` and the production on each push on `main`.

## Local stack

### create a PAT (Personal Access Token) (first time only)

this will be neeeded to download packages from github registry

login to your GitHub account and go to https://github.com/settings/tokens

click "Generate new token" and confirm your password

set note and expiration of the token and for the scopes, select only `read:packages`

click "generate token"

copy the token `ghp_xxxxxxxxxxxxxxxxxxx` (it won't be shown again)

### login to github (first time only)

open a terminal

first export your PAT

Note: start the export command with a space so it is not memorized by bash history

```
$  export CR_PAT=ghp_xxxxxxxxxxxxxxxxxxx
```

then login to github registry

```
$ echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
```

### set /etc/hosts (first time only)

add this entry:

```
127.0.0.1       minio
```

### launch the stach

```bash
$ docker-compose up
```

and wait for output to display

```
projects-api_1  | + uvicorn projects.asgi:application --proxy-headers --host 0.0.0.0 --port 8080
```

### export env var for lauching inite2e

Obtain the keycloak client secret and export it along with a projects' super admin account credentials (eg yours) so you can create initial data in next step

Important: it is advised to **start the command with a space so it is not memorized in bash history**

```bash
$  export KEYCLOAK_CLIENT_SECRET=XXXXXXX KEYCLOAK_USERNAME=XXXXX@learningplanetinstitute.org KEYCLOAK_PASSWORD=XXXXXXX
```

### init dataset

this will create

-   a directory
-   an organization (with code CRI)
-   a category (reviewable)
-   two initial projects

```bash
$ node tests/e2e/init.js
```

### set .env

use local API server and default version

```
VITE_APP_API_URL=http://localhost:8000
VITE_APP_API_DEFAULT_VERSION=/v1
```

use local socket server

```
VITE_APP_WSS_HOST=localhost:8080
VITE_APP_WSS_HOST_PROXIED=localhost:8888
```

note that localhost:8080 is the url of the fornt-end, it will proxy request to the socket server witch runs on localhost:8888

### start front-end

```bash
$ yarn serve
```
