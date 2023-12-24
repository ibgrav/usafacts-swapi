# USAFacts SWAPI

### Production CDN URL [usafacts.isaac.works](https://usafacts.isaac.works)

### Production Container URL [usafacts-swapi-production.up.railway.app](https://usafacts-swapi-production.up.railway.app/)

### Production Storybook URL [usafacts-storybook.isaac.works](https://usafacts-storybook.isaac.works)

## Overview

- `backend`: A Node.js server that serves data from the [SWAPI](https://swapi.dev/documentation#films) API.
- `frontend`: A React app that displays the data from the backend via a chart.
- `.storybook`: A Storybook instance that displays the frontend components in isolation, for testing and rapid development.
- `bin`: Contains scripts for running local development and testing.
- `mock`: Contains mock data and utilities used for testing.
- `public`: Contains static assets for the frontend.
- `types`: Contains shared types between the backend and frontend.

## Deployment

- A GitHub hook is setup with the host [Railway](https://railway.app/) to deploy the container.
- The Dockerfile delpoys both the `backend` Node.js application and the `frontend` static assets to a single container.
- A CNAME is set through Cloudflare's CDN to the Railway container URL for performance and caching.
- A GitHub hook is setup with Cloudflare Pages to host the static storybook assets.

## Local Development

- This repo requires [pnpm](https://pnpm.io/installation)
- Run `pnpm install` to install dependencies
- Run `pnpm dev` to start the backend, frontend, and storybook development servers.
- Run `pnpm test` to run automated testing for the backend, frontend, and storybook.

## Testing

- TypeScript is used throughout each project in `strict` mode, offering high levels of type testing
- ESLint is used to lint each project for common errors and code style
- `backend` uses vitest to run automated testing
- `frontend` uses the `@storybook/test` library to run automated testing
- On push or pull request, GitHub Actions will run all automated testing via `.github/workflows/test.yml`
- There is nowhere close to enough testing in this repo, but it was mostly for demonstration purposes.
- I would add integation testing as well, preferably Playwright.

## Todos / Future Improvements

- Expand testing
- Add better linting
- Add more documentation
- Add convention tooling through commit hooks
- Use the API mocks gathered to test the backend more thoroughly
- Ideally there are branch-based previews that build when a PR is opened for true CI testing
