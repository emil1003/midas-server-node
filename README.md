# midas-server-node
Example implementation of [Midas API v1.0.0 Spec](./openapi.yml) on Node.js, written in Typescript with a MongoDB database backend.

> [!IMPORTANT]
> midas-server-node does not yet possess the ability to create users, accounts or currencies. These must be created in its database manually.

## Running
In order to run `midas-server-node`, it requires:
- A running MongoDB instance, a database named `midas` will be automatically created
- Setting envvars, an example of which is in `example.env`. When running `npm start`, the file `.env` will be parsed
- Providing a `manifest.json`, an example of which is in `manifest.example.json`
- Building the TS source: `npm i && npm run build`

Midas can then be started with `npm start`

