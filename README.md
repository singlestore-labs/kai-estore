# SingleStore | eStore

## Requirements

- `Node.js` version is at least `v18.15.0`
- `Docker` and `docker-compose`

## Run the dev environment in Docker

1. Create a `.env` file in the `root` of the project based on the `.env.sample` file once
2. Run `make dev-build` once
3. Run `make dev-start`
4. Open [http://localhost:3000](http://localhost:3000)

To stop the `dev` environment in Docker run `make dev-down`

## Build the prod environment in Docker

1. Create a `.env` file in the `root` of the project based on the `.env.sample` file once
2. Run `make prod-build` once
3. Run `make prod-start`
4. Open [http://localhost:3000](http://localhost:3000)

To stop the `prod` environment in Docker run `make prod-down`

## Generate data

1. Change the directory to the `./data` directory
2. Run `npm i` once
3. Run `npm run generate -- --name dataset-s|m|l --users NUMBER --products NUMBER --orders NUMBER`
4. Copy the generated data from the `./data/export` directory to the `./server/src/data` directory

## Reset data

1. Go to http://localhost:3000/configure
2. Click on the `Reset data` button
