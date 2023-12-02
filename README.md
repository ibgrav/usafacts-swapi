# USAFacts SWAPI

## Overview

- This repo contains two TypeScript packages:
  - `backend`: A Node.js server that serves data from the [SWAPI](https://swapi.dev/documentation#films) API.
  - `frontend`: A React app that displays the data from the backend via a chart.

## Local Development

- This repo uses [pnpm](https://pnpm.io/installation)
- Run `pnpm install` to install dependencies
- Run `pnpm dev` to start both the backend and frontend development servers

## Testing

- TypeScript is used throughout each project in `strict` mode, offering high levels of type testing
- ESLint is used to lint each project for common errors and code style
- `backend` uses vitest to run automated testing
- `frontend` uses the `@storybook/test` library to run automated testing
- On push or pull request, GitHub Actions will run all automated testing via `.github/workflows/test.yml`

## Deployment

- The Dockerfile delpoys both the `backend` Node.js application and the `frontend` static assets to a single container.
- A GitHub hook is setup with the host [Railway](https://railway.app/) to deploy the container.
- The container can be directly accessed here: https://usafacts-swapi-production.up.railway.app/

## Todos / Future Improvements

- Expand testing
- Add better linting
