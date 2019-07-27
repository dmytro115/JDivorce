[![CircleCI](https://circleci.com/gh/rhuang/jdivorce-ui.svg?style=shield&circle-token=15ef8d52c935fc54b77c4d2d88ccabc7b9cb9f5a)](https://circleci.com/gh/rhuang/jdivorce-ui)
![Ghost Inspector](https://api.ghostinspector.com/v1/suites/5b808ea7f818e309454ddd1f/status-badge)

**Staging**:  
![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoicjJXK3czK0hEL3hoOXQ3b3FqekNZdUtVYSs1SnpvWjNLOERXRlNHVXJncXArQ0dNUm1ESVdvVHRiRW1wd2FhVHpNNUpJQVg5Rks2eGhweTJTRWhQRnJBPSIsIml2UGFyYW1ldGVyU3BlYyI6IlhxemhxMVh1M1pQeDBsWjUiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

**Production**:  
![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiVjVkTjlhRVhkNllndGFnNUxibG05Z1M2bU5UdmZFR1VUZGFqeFROQStENEtES2lRVitJMTh3Z0dIR1N4dEZLM1NnK0ZmOVFrK1BNcjNrS0ZvK1FHbHpNPSIsIml2UGFyYW1ldGVyU3BlYyI6InFCbUlhZFlKa3FZN3FsY1AiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.5.

1. Install [Node.js](https://nodejs.org/en/).
2. Install [NVM](https://github.com/creationix/nvm).
3. Run `npm install` in the root folder.
4. If you don't have `juristium-clone` running, then change the [serverUrl](https://github.com/rhuang/jdivorce-ui/blob/master/src/environments/environment.ts#L7) to `https://test-api.jdivorce.com`. An easier alternative is to run the application in `staging`, and it will use the config in `environment.staging.ts`. Our staging (test) environment is at https://test.jdivorce.com, and both local and staging environments use the same database.

## Theme

[AdminPress Theme](http://themedesigner.in/demo/admin-press/main/index.html)

Everything under `src/assets/ap/*` are source files for the AdminPress theme. Please do not add/edit/remove ANYTHING from that folder.

We use this theme for a lot of the existing styling. However, we have started to migrate into [Angular Material](https://material.angular.io/), while keeping the theme more or less the same. We will use as many Angular Material components as possible.

Our Angular Material theme is here: https://github.com/rhuang/jdivorce-ui/blob/master/src/custom-theme.scss
Common styling on Angular Material components is here: https://github.com/rhuang/jdivorce-ui/blob/master/src/assets/scss/am.scss

When styling, do not use Bootstrap or AdminPress classes. We would like to remove all references to these 2 libraries.

## Coding Styles

Install the [TSLint plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) for Visual Studio Code. We use [this](https://github.com/ng-seed/angular-tslint-rules) configuration for TSLint with some minor adjustments in `tslint.json`.

Install the [Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for formatting on all files. Please format every file you touch. Our own minor adjustments are in `.prettierrc`.

For commits, we follow [Conventional Commits](https://www.conventionalcommits.org/). Please make sure you link the original issue in the body of the commit. For issues in [juristium-clone](https://github.com/rhuang/juristium-clone), please enter the full link. For issues in this repository, adding `#issueNumber` is sufficient.

Please enable `formatOnSave` in VS Code.

**Please follow the [Angular Style Guide](https://angular.io/guide/styleguide) as closely as possible.**

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
