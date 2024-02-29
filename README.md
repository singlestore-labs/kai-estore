# SingleStore | eStore

## Requirements

- `Node.js` at least `v18.15.0`

## Getting started

1. Create a `.env` file based on the `.env.sample` file
2. Install dependencies by running: `npm i`

## Run the dev environment

1. Run `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)

## Build the prod environment

1. Run `npm run build`
2. Run `npm run start`
3. Open [http://localhost:3000](http://localhost:3000)

## Generate data

1. Change the directory to the `./data` directory
2. Run `npm i` once
3. Run `npm run generate -- --name dataset-s|m|l --users NUMBER --products NUMBER --orders NUMBER`
4. Copy the generated data from the `./data/export` directory to the `./apps/server/src/data` directory

## Reset data

1. Go to http://localhost:3000/configure
2. Click on the `Reset data` button
