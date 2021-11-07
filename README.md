# User system

## Development setup

### Environment

* Install node.js
    * `nvm` is recommended to manage node version, see [here](https://github.com/nvm-sh/nvm#installing-and-updating) for details.
    * or you can install `node.js` manually [here](https://nodejs.org/en/download/).
    * the specific version we are using, can be found in `./dockerfile`.
* Install git
    * normally it's already installed on Linux/MacOS.
    * Windows users can install from [here](https://git-scm.com/downloads).
* Install docker & docker-compose
    * check details [here](https://docs.docker.com/get-docker/) and [here](https://docs.docker.com/compose/install/).
* Install editor
    * [VSCode](https://code.visualstudio.com/download) is recommended.
    * NOTE: whatever editor you choose, you MUST enable `eslint` plugin.

### Configuration

* create `.env` file, copy from `.env.example`. modify it if nessesary.

### Dependencies

* run `npm i` to install node dependencies.
* run `docker-compose -f local.compose.yml up` to set up database.
    * by default, you can visit [admin panel](http://localhost:9002) to check if the database is working.
    * database configuration is in the `local.compose.yml` file.

## Developing

### Project structure

|`asset` contains fixed assets say icon, audio or text.
|`dist` contains all compiled files for production.
|`docker_volumes` as name suggests.
|`node_modules` as name suggests.
|`src` contains source codes.
|---|`config` as name suggests.
|---|`controller` a placeholder for now.
|---|`db` database related stuff.
|---|---|`migration` including all db structure changes. NOTICE: DO NOT modify db directly. all updates should be written here.
|---|---|`schema` model level. generated by migration process.
|---|---|`pg.ts` a warpper for orignal pg apis and some dumb homemade crud apis.
|---|`entry` as name suggests.
|---|`logger` as name suggests.
|---|`router` as name suggests.
|---|---|`index.ts` maintain the main Router class, install routes when starting app.
|---|---|`*.ts` the rest should be exposed api routes.
|---|`service` all modules that 'actually' do things, mapped from model, and other non-model services
|---|---|`index.ts` an entry that loads all services when start app.
|---|---|`oauth*.ts` as name suggests.
|---|---|`request.ts` connection warpper.
|---|---|`session.ts` session management.
|---|---|`*.ts` other model mapping services.
|---|`test` test cases.
|---|`utils` independent functional programs.

* the rest of the files in root are mostly configuration files, DO NOT TOUCH unless you clearly understand what you are doing.

### CLI commands

* run `npm run migrate` to init or update database structure.
* run `npm run dev`, visit [backend health check](http://localhost:9000/ping) to check if everything goes ok.
* run `npm run test` to run tests.
* run `npm run lint` to check code style.
* run `npm run watch` to watch src files change and generate prod files.
* run `npm start` to watch built files and running.
* run `npm run build` to generate prod files.
* run `npm run prod` to start backend in production mode.
* run `docker build -f ./Dockerfile --no-cache -t backend:local .` to build image locally.
* run `docker-compose -f local.test.yml up` to test built image.

Note: for some npm commands, you can add `--h` option to check details how it can be used.
